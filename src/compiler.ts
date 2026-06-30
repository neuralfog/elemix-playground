import initElemix, {
    compile as lowerElemix,
} from '@neuralfog/elemix-compiler-wasm/elemix_compiler.js';
import elemixWasmURL from '@neuralfog/elemix-compiler-wasm/elemix_compiler_bg.wasm?url';
import * as esbuild from 'esbuild-wasm/esm/browser.js';
import wasmURL from 'esbuild-wasm/esbuild.wasm?url';
import type { Files } from './files';
import { ENTRY } from './files';

let ready: Promise<void> | null = null;

// Init both wasm engines once: esbuild (bundling) and the elemix compiler
// (template/hint lowering). Every `.ts` source is lowered by elemix before
// esbuild ever sees it — `tpl` is compile-only and throws at runtime raw.
const init = (): Promise<void> => {
    ready ??= Promise.all([
        esbuild.initialize({ wasmURL, worker: true }),
        initElemix({ module_or_path: elemixWasmURL }),
    ]).then(() => undefined);
    return ready;
};

const EXTERNAL = '@neuralfog/elemix';

const virtualFsPlugin = (files: Files): esbuild.Plugin => ({
    name: 'virtual-fs',
    setup(build) {
        build.onResolve({ filter: /^@neuralfog\/elemix/ }, (args) => ({
            path: args.path,
            external: true,
        }));

        build.onResolve({ filter: /\.s[ac]ss(\?.*)?$/ }, (args) => {
            const bare = args.path.replace(/\?.*$/, '');
            const resolved = resolvePath(bare, args.importer, files);
            if (!resolved) {
                return {
                    errors: [
                        {
                            text: `Cannot resolve stylesheet "${args.path}" from "${args.importer || ENTRY}"`,
                        },
                    ],
                };
            }
            return { path: resolved, namespace: 'scss' };
        });

        build.onLoad({ filter: /.*/, namespace: 'scss' }, async (args) => {
            const source = files[args.path];
            if (source === undefined) {
                return {
                    errors: [{ text: `Missing stylesheet: ${args.path}` }],
                };
            }
            try {
                const css = await compileScss(source, args.path, files);
                return {
                    contents: `export default ${JSON.stringify(css)};`,
                    loader: 'js',
                };
            } catch (err) {
                return {
                    errors: [
                        {
                            text: `SCSS compile error in ${args.path}: ${(err as Error).message}`,
                        },
                    ],
                };
            }
        });

        build.onResolve({ filter: /.*/ }, (args) => {
            if (
                args.path === EXTERNAL ||
                args.path.startsWith(`${EXTERNAL}/`)
            ) {
                return { path: args.path, external: true };
            }
            const resolved = resolvePath(args.path, args.importer, files);
            if (!resolved) {
                return {
                    errors: [
                        {
                            text: `Cannot resolve "${args.path}" from "${args.importer || ENTRY}"`,
                        },
                    ],
                };
            }
            return { path: resolved, namespace: 'virtual' };
        });

        build.onLoad({ filter: /.*/, namespace: 'virtual' }, (args) => {
            const contents = files[args.path];
            if (contents === undefined) {
                return { errors: [{ text: `Missing file: ${args.path}` }] };
            }
            const loader = loaderFor(args.path);
            // Lower elemix sources (tpl templates + `// #` compiler hints) to
            // plain runtime calls before bundling. Other loaders pass through.
            if (loader === 'ts' || loader === 'tsx') {
                try {
                    return { contents: lowerElemix(contents), loader };
                } catch (err) {
                    return {
                        errors: [
                            {
                                text: `elemix compile error in ${args.path}: ${(err as Error).message ?? String(err)}`,
                            },
                        ],
                    };
                }
            }
            return { contents, loader };
        });
    },
});

const LOADERS: Record<string, esbuild.Loader> = {
    ts: 'ts',
    tsx: 'tsx',
    js: 'js',
    jsx: 'jsx',
    css: 'text',
    json: 'json',
};

const loaderFor = (path: string): esbuild.Loader =>
    LOADERS[path.split('.').pop() ?? ''] ?? 'ts';

const EXTENSIONS = ['', '.ts', '.tsx', '.js', '.jsx', '.json'];

const resolvePath = (
    spec: string,
    importer: string,
    files: Files,
): string | null => {
    const isRelative = spec.startsWith('./') || spec.startsWith('../');
    const dir =
        isRelative && importer.includes('/')
            ? importer.slice(0, importer.lastIndexOf('/'))
            : '';
    const base = normalize(dir ? `${dir}/${spec}` : spec);

    for (const ext of EXTENSIONS) {
        if (files[base + ext] !== undefined) return base + ext;
    }
    for (const ext of EXTENSIONS.slice(1)) {
        if (files[`${base}/index${ext}`] !== undefined)
            return `${base}/index${ext}`;
    }
    return null;
};

const normalize = (path: string): string => {
    const out: string[] = [];
    for (const part of path.split('/')) {
        if (part === '' || part === '.') continue;
        if (part === '..') out.pop();
        else out.push(part);
    }
    return out.join('/');
};

let sassMod: Promise<typeof import('sass')> | null = null;
const loadSass = (): Promise<typeof import('sass')> => {
    sassMod ??= import('sass');
    return sassMod;
};

const scssImporter = (files: Files): import('sass').Importer<'sync'> => ({
    canonicalize(url) {
        const name = url.replace(/^vfs:\/*/, '').replace(/^\.\//, '');
        const segs = name.split('/');
        const base = segs.pop() ?? name;
        const dir = segs.length ? `${segs.join('/')}/` : '';
        const candidates = [
            name,
            `${name}.scss`,
            `${name}.sass`,
            `${dir}_${base}`,
            `${dir}_${base}.scss`,
            `${dir}_${base}.sass`,
        ];
        const hit = candidates.find((c) => files[c] !== undefined);
        return hit ? new URL(`vfs:///${hit}`) : null;
    },
    load(canonicalUrl) {
        const key = decodeURIComponent(canonicalUrl.pathname).replace(
            /^\/+/,
            '',
        );
        return {
            contents: files[key] ?? '',
            syntax: key.endsWith('.sass') ? 'indented' : 'scss',
        };
    },
});

const compileScss = async (
    source: string,
    path: string,
    files: Files,
): Promise<string> => {
    const sass = await loadSass();
    const result = sass.compileString(source, {
        syntax: path.endsWith('.sass') ? 'indented' : 'scss',
        loadPaths: [],
        importers: [scssImporter(files)],
    });
    return result.css;
};

export type CompileResult =
    | { ok: true; code: string; warnings: string[] }
    | { ok: false; errors: string[] };

export const compile = async (files: Files): Promise<CompileResult> => {
    await init();
    try {
        const result = await esbuild.build({
            entryPoints: [ENTRY],
            bundle: true,
            write: false,
            format: 'esm',
            platform: 'browser',
            target: 'es2022',
            sourcemap: 'inline',
            plugins: [virtualFsPlugin(files)],
            tsconfigRaw: {
                compilerOptions: {
                    experimentalDecorators: true,
                    useDefineForClassFields: false,
                },
            },
        });
        return {
            ok: true,
            code: result.outputFiles[0].text,
            warnings: result.warnings.map(formatMessage),
        };
    } catch (err) {
        const errors =
            err &&
            typeof err === 'object' &&
            'errors' in err &&
            Array.isArray((err as esbuild.BuildFailure).errors)
                ? (err as esbuild.BuildFailure).errors.map(formatMessage)
                : [String(err)];
        return { ok: false, errors };
    }
};

const formatMessage = (m: esbuild.Message | esbuild.PartialMessage): string => {
    const loc = m.location
        ? ` (${m.location.file}:${m.location.line}:${m.location.column})`
        : '';
    return `${m.text}${loc}`;
};

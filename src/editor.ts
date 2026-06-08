import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import {
    conf as scssConf,
    language as scssLang,
} from 'monaco-editor/esm/vs/basic-languages/scss/scss.js';
import {
    conf as cssConf,
    language as cssLang,
} from 'monaco-editor/esm/vs/basic-languages/css/css.js';
import { language as tsLang } from 'monaco-editor/esm/vs/basic-languages/typescript/typescript.js';
import { elemixDts } from './generated/elemix-dts';
import type { Files } from './files';

const monacoEnv: monaco.Environment = {
    getWorker(_id: string, label: string) {
        if (label === 'typescript' || label === 'javascript')
            return new tsWorker();
        if (label === 'css' || label === 'scss' || label === 'less')
            return new cssWorker();
        return new editorWorker();
    },
};
(
    self as unknown as { MonacoEnvironment: monaco.Environment }
).MonacoEnvironment = monacoEnv;

const ELEMIX_PATHS: Record<string, string[]> = {
    '@neuralfog/elemix': ['node_modules/@neuralfog/elemix/index'],
    '@neuralfog/elemix/state': ['node_modules/@neuralfog/elemix/state'],
    '@neuralfog/elemix/directives': [
        'node_modules/@neuralfog/elemix/directives',
    ],
    '@neuralfog/elemix/render': ['node_modules/@neuralfog/elemix/render'],
    '@neuralfog/elemix/signal': ['node_modules/@neuralfog/elemix/signal'],
    '@neuralfog/elemix/reactive': ['node_modules/@neuralfog/elemix/reactive'],
    '@neuralfog/elemix/utilities': ['node_modules/@neuralfog/elemix/utilities'],
};

let configured = false;

const configureTypeScript = (): void => {
    if (configured) return;
    configured = true;

    monaco.languages.setLanguageConfiguration('scss', scssConf);
    monaco.languages.setMonarchTokensProvider('scss', scssLang);
    monaco.languages.setLanguageConfiguration('css', cssConf);
    monaco.languages.setMonarchTokensProvider('css', cssLang);

    const decoratorRule: monaco.languages.IMonarchLanguageRule = [
        /@[a-zA-Z_$][\w$]*/,
        'annotation',
    ];
    const decoratedTs: monaco.languages.IMonarchLanguage = {
        ...tsLang,
        tokenizer: {
            ...tsLang.tokenizer,
            common: [decoratorRule, ...tsLang.tokenizer.common],
        },
    };
    monaco.languages.setMonarchTokensProvider('typescript', decoratedTs);
    monaco.languages.setMonarchTokensProvider('javascript', decoratedTs);

    defineTheme();

    const ts = monaco.languages.typescript.typescriptDefaults;
    ts.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2020,
        module: monaco.languages.typescript.ModuleKind.ESNext,
        moduleResolution:
            monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        experimentalDecorators: true,
        useDefineForClassFields: false,
        allowNonTsExtensions: true,
        noEmit: true,
        strict: true,
        skipLibCheck: true,
        baseUrl: 'file:///',
        paths: ELEMIX_PATHS,
    });
    ts.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
    });

    ts.setEagerModelSync(true);

    for (const [path, contents] of Object.entries(elemixDts)) {
        ts.addExtraLib(contents, `file:///${path}`);
    }

    ts.addExtraLib(
        [
            "declare module '*.scss?inline' { const css: string; export default css; }",
            "declare module '*.sass?inline' { const css: string; export default css; }",
            "declare module '*.css?inline' { const css: string; export default css; }",
            "declare module '*.scss' { const css: string; export default css; }",
            "declare module '*.sass' { const css: string; export default css; }",
            "declare module '*.css' { const css: string; export default css; }",
        ].join('\n'),
        'file:///globals.d.ts',
    );
};

const defineTheme = (): void => {
    monaco.editor.defineTheme('elemix-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: '', foreground: 'e7e7ea' },
            { token: 'comment', foreground: '5b5b67', fontStyle: 'italic' },
            { token: 'keyword', foreground: 'c4b5fd' },
            { token: 'keyword.flow', foreground: 'c4b5fd' },
            { token: 'storage', foreground: 'c4b5fd' },
            { token: 'string', foreground: '9ece6a' },
            { token: 'string.escape', foreground: '7dd3fc' },
            { token: 'number', foreground: 'f0a868' },
            { token: 'number.hex', foreground: 'f0a868' },
            { token: 'regexp', foreground: 'f7768e' },
            { token: 'type', foreground: '2dd4bf' },
            { token: 'type.identifier', foreground: '2dd4bf' },
            { token: 'identifier', foreground: 'e7e7ea' },
            { token: 'delimiter', foreground: '8b8b99' },
            { token: 'delimiter.bracket', foreground: '8b8b99' },
            { token: 'delimiter.parenthesis', foreground: '8b8b99' },
            { token: 'operator', foreground: '8b8b99' },
            { token: 'annotation', foreground: 'e5c07b' },
            { token: 'tag', foreground: 'f7768e' },
            { token: 'attribute.name', foreground: '7aa2f7' },
            { token: 'attribute.value', foreground: '9ece6a' },
            { token: 'attribute.value.unit', foreground: 'f0a868' },
            { token: 'variable', foreground: 'e0af68' },
        ],
        colors: {
            'editor.background': '#0e0e13',
            'editor.foreground': '#e7e7ea',
            'editorLineNumber.foreground': '#3a3a44',
            'editorLineNumber.activeForeground': '#9a9aa6',
            'editor.lineHighlightBackground': '#16161d',
            'editor.lineHighlightBorder': '#00000000',
            'editor.selectionBackground': '#6366f140',
            'editor.inactiveSelectionBackground': '#6366f122',
            'editor.wordHighlightBackground': '#6366f126',
            'editorCursor.foreground': '#8b5cf6',
            'editorIndentGuide.background': '#1d1d25',
            'editorIndentGuide.activeBackground': '#34343f',
            'editorWhitespace.foreground': '#24242c',
            'editorGutter.background': '#0e0e13',
            'editorBracketMatch.background': '#6366f12e',
            'editorBracketMatch.border': '#6366f180',
            'editorWidget.background': '#16161d',
            'editorWidget.border': '#26262e',
            'editorSuggestWidget.background': '#16161d',
            'editorSuggestWidget.border': '#26262e',
            'editorSuggestWidget.selectedBackground': '#6366f133',
            'editorHoverWidget.background': '#16161d',
            'editorHoverWidget.border': '#26262e',
            'minimap.background': '#0e0e13',
            'scrollbarSlider.background': '#2f2f3899',
            'scrollbarSlider.hoverBackground': '#3d3d48',
            'scrollbarSlider.activeBackground': '#45454f',
        },
    });
};

export interface EditorHandle {
    open(path: string): void;
    current(): string;
    paths(): string[];
    files(): Files;
    load(files: Files): void;
    onChange(cb: () => void): void;
    layout(): void;
}

export const createEditor = (
    container: HTMLElement,
    initial: Files,
): EditorHandle => {
    configureTypeScript();

    const models = new Map<string, monaco.editor.ITextModel>();
    const changeCallbacks: Array<() => void> = [];
    let currentPath = '';

    const buildModels = (files: Files): void => {
        for (const model of models.values()) model.dispose();
        models.clear();

        for (const [path, contents] of Object.entries(files)) {
            const uri = monaco.Uri.parse(`file:///${path}`);
            const model = monaco.editor.createModel(
                contents,
                langFor(path),
                uri,
            );
            model.onDidChangeContent(() => {
                for (const cb of changeCallbacks) cb();
            });
            models.set(path, model);
        }
        currentPath = Object.keys(files)[0] ?? '';
    };

    buildModels(initial);

    const firstModel = models.get(currentPath);
    if (!firstModel) throw new Error('createEditor: no files provided');

    const editor = monaco.editor.create(container, {
        model: firstModel,
        theme: 'elemix-dark',
        automaticLayout: true,
        minimap: { enabled: false },
        fontSize: 15,
        lineHeight: 24,
        fontFamily:
            '"JetBrains Mono", "Fira Code", "SF Mono", "Cascadia Code", ui-monospace, Menlo, Consolas, monospace',
        fontLigatures: true,
        letterSpacing: 0.2,
        tabSize: 4,
        scrollBeyondLastLine: false,
        fixedOverflowWidgets: true,
        smoothScrolling: true,
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
        renderLineHighlight: 'all',
        roundedSelection: true,
        padding: { top: 14, bottom: 14 },
        scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10 },
    });

    return {
        open(path) {
            const model = models.get(path);
            if (!model) return;
            currentPath = path;
            editor.setModel(model);
            editor.focus();
        },
        current: () => currentPath,
        paths: () => [...models.keys()],
        files() {
            const out: Files = {};
            for (const [path, model] of models) out[path] = model.getValue();
            return out;
        },
        load(files) {
            buildModels(files);
            const model = models.get(currentPath);
            if (model) editor.setModel(model);
        },
        onChange(cb) {
            changeCallbacks.push(cb);
        },
        layout: () => editor.layout(),
    };
};

const langFor = (path: string): string => {
    if (path.endsWith('.ts') || path.endsWith('.tsx')) return 'typescript';
    if (path.endsWith('.js') || path.endsWith('.jsx')) return 'javascript';
    if (path.endsWith('.scss') || path.endsWith('.sass')) return 'scss';
    if (path.endsWith('.css')) return 'css';
    if (path.endsWith('.json')) return 'json';
    if (path.endsWith('.html')) return 'html';
    return 'plaintext';
};

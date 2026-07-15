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
import {
    conf as htmlConf,
    language as htmlLang,
} from 'monaco-editor/esm/vs/basic-languages/html/html.js';
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

    // HTML is embedded inside `tpl`/`html` template literals (see decoratedTs).
    // Register its grammar so the embedding has a tokenizer to delegate to.
    if (!monaco.languages.getLanguages().some((l) => l.id === 'html')) {
        monaco.languages.register({ id: 'html' });
    }
    monaco.languages.setLanguageConfiguration('html', htmlConf);
    monaco.languages.setMonarchTokensProvider('html', htmlLang);

    // elemix template bindings (`:prop` `:ref` `@event` `~model` `~onmodel`) are
    // not valid HTML attribute names, so the stock grammar mis-colours them. A
    // cloned HTML grammar tags them `attribute.binding` (themed yellow) inside an
    // open tag; `tpl` embeds this variant instead of plain html.
    monaco.languages.register({ id: 'elemix-html' });
    monaco.languages.setLanguageConfiguration('elemix-html', htmlConf);
    monaco.languages.setMonarchTokensProvider('elemix-html', {
        ...htmlLang,
        tokenizer: {
            ...htmlLang.tokenizer,
            // Inside an open tag, a binding is just the next attribute.
            otherTag: [
                [/[:@~][\w-]+/, 'attribute.binding'],
                ...htmlLang.tokenizer.otherTag,
            ],
            // Each `${…}` un-embeds and re-embeds HTML, which restarts the grammar
            // at `root` mid-tag - so a binding after the first interpolation is seen
            // here, not in `otherTag`. Match it with its leading whitespace so this
            // wins over root's greedy `[^<]+` text rule.
            root: [
                [/(\s+)([:@~][\w-]+)/, ['', 'attribute.binding']],
                ...htmlLang.tokenizer.root,
            ],
        },
    });

    const decoratorRule: monaco.languages.IMonarchLanguageRule = [
        /@[a-zA-Z_$][\w$]*/,
        'annotation',
    ];

    // `tpl`/`html` tagged templates carry HTML - tokenize their contents with
    // the embedded HTML grammar. Each `${…}` interpolation is handed back to TS:
    // `bracketCounting` (a stock state) already balances nested braces and even
    // nested `tpl`` templates, and the closing `}` re-embeds HTML.
    const tplRule: monaco.languages.IMonarchLanguageRule = [
        /(tpl|html)(`)/,
        [
            'attribute.binding',
            { token: 'string', next: '@tplHtml', nextEmbedded: 'elemix-html' },
        ],
    ];
    const decoratedTs: monaco.languages.IMonarchLanguage = {
        ...tsLang,
        tokenizer: {
            ...tsLang.tokenizer,
            common: [decoratorRule, tplRule, ...tsLang.tokenizer.common],
            tplHtml: [
                [
                    /\$\{/,
                    {
                        token: 'delimiter.bracket',
                        next: '@tplInterp',
                        nextEmbedded: '@pop',
                    },
                ],
                [/`/, { token: 'string', next: '@pop', nextEmbedded: '@pop' }],
            ],
            tplInterp: [
                [
                    /\}/,
                    {
                        token: 'delimiter.bracket',
                        next: '@pop',
                        nextEmbedded: 'elemix-html',
                    },
                ],
                [
                    /\{/,
                    { token: 'delimiter.bracket', next: '@bracketCounting' },
                ],
                { include: 'common' },
            ],
        },
    };
    monaco.languages.setMonarchTokensProvider('typescript', decoratedTs);
    monaco.languages.setMonarchTokensProvider('javascript', decoratedTs);

    registerTemplateCompletions();
    registerHintCompletions();
    registerHintHovers();

    defineTheme();

    const ts = monaco.typescript.typescriptDefaults;
    ts.setCompilerOptions({
        target: monaco.typescript.ScriptTarget.ES2020,
        module: monaco.typescript.ModuleKind.ESNext,
        moduleResolution: monaco.typescript.ModuleResolutionKind.NodeJs,
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

const EVENT_NAMES = [
    'click',
    'dblclick',
    'input',
    'change',
    'submit',
    'keydown',
    'keyup',
    'focus',
    'blur',
    'mouseenter',
    'mouseleave',
    'pointerdown',
    'pointerup',
    'scroll',
    'wheel',
];

const ATTR_NAMES = [
    'class',
    'style',
    'id',
    'value',
    'checked',
    'disabled',
    'hidden',
    'href',
    'src',
    'title',
    'placeholder',
    'type',
    'name',
];

// True when the cursor sits inside an open tag (`<… |`) that is itself inside an
// unclosed `tpl`/`html` template - the only place a binding attribute is valid.
const inTemplateTag = (textUntil: string): boolean => {
    const lt = textUntil.lastIndexOf('<');
    const gt = textUntil.lastIndexOf('>');
    if (lt <= gt) return false;
    const head = textUntil.slice(0, lt);
    const open = Math.max(head.lastIndexOf('tpl`'), head.lastIndexOf('html`'));
    if (open === -1) return false;
    const tick = head.indexOf('`', open);
    return !head.slice(tick + 1).includes('`');
};

// `:ref`/`~model`/`@click`/… completions inside `tpl` templates. The model is a
// TS document (HTML is only an embedded tokenizer), so the provider runs on
// typescript/javascript and gates on `inTemplateTag`. Each item inserts the
// binding plus an empty `${}` interpolation with the caret parked inside.
const registerTemplateCompletions = (): void => {
    const provider: monaco.languages.CompletionItemProvider = {
        triggerCharacters: [':', '@', '~'],
        provideCompletionItems(model, position) {
            const textUntil = model.getValueInRange({
                startLineNumber: 1,
                startColumn: 1,
                endLineNumber: position.lineNumber,
                endColumn: position.column,
            });
            if (!inTemplateTag(textUntil)) return { suggestions: [] };

            const line = model.getLineContent(position.lineNumber);
            const typed = line
                .slice(0, position.column - 1)
                .match(/[:@~][\w-]*$/);
            const range = new monaco.Range(
                position.lineNumber,
                typed ? position.column - typed[0].length : position.column,
                position.lineNumber,
                position.column,
            );

            const item = (
                label: string,
                detail: string,
                kind: monaco.languages.CompletionItemKind,
            ): monaco.languages.CompletionItem => ({
                label,
                kind,
                detail,
                insertText: `${label}=\\\${$1}`,
                insertTextRules:
                    monaco.languages.CompletionItemInsertTextRule
                        .InsertAsSnippet,
                range,
            });

            const E = monaco.languages.CompletionItemKind.Event;
            const P = monaco.languages.CompletionItemKind.Property;

            return {
                suggestions: [
                    item(':ref', 'element reference', P),
                    item('~model', 'two-way bound value', P),
                    item('~onmodel', 'model write transform', P),
                    ...EVENT_NAMES.map((e) =>
                        item(`@${e}`, `${e} event handler`, E),
                    ),
                    ...ATTR_NAMES.map((a) => item(`:${a}`, `bind ${a}`, P)),
                ],
            };
        },
    };
    monaco.languages.registerCompletionItemProvider('typescript', provider);
    monaco.languages.registerCompletionItemProvider('javascript', provider);
};

// elemix compiler hints - `// #…` comment macros. Class-level ones sit above the
// class; member-level ones above a field or method. Offered together so the menu
// is a single discoverable list; the detail says where each applies.
const HINTS: Array<{
    name: string;
    detail: string;
    doc: string;
    snippet?: string;
}> = [
    {
        name: '#component',
        detail: 'class → register as a custom element',
        doc: 'Registers the class as a custom element (emits `defineComponent`). Place above the class - without it the element is never defined and `<my-element>` stays inert.',
    },
    {
        name: '#tag',
        detail: 'class → set the custom element tag name',
        // biome-ignore lint/suspicious/noTemplateCurlyInString: monaco snippet placeholder syntax
        snippet: '#tag ${1:my-element}',
        doc: 'Sets the custom element tag name.\n\n```ts\n// #tag user-card\n```\n\nPlace above the class. The name must contain a hyphen.',
    },
    {
        name: '#form',
        detail: 'class → form-associated custom element',
        doc: 'A form-associated custom element - works inside a form like a native input. Place above the class.',
    },
    {
        name: '#no-shadow',
        detail: 'class → render to light DOM (no shadow root)',
        doc: 'Renders into the **light DOM** instead of a shadow root (skips `attachShadow`). Styles are not encapsulated. Place above the class.',
    },
    {
        name: '#shadow',
        detail: 'class → force a shadow root',
        doc: 'Forces a **shadow root** (`attachShadow`) when light DOM is the default. Place above the class.',
    },
    {
        name: '#styles',
        detail: 'member → component styles (CSS string)',
        doc: 'Component styles, as a string. Adopted into the shadow root. Place above the field.',
    },
    {
        name: '#state',
        detail: 'field or export → reactive state / store',
        doc: 'Marks reactive state: component state on a class field, a store (global state) on a module-level export.',
    },
    {
        name: '#effect',
        detail: 'member → reactive effect',
        doc: 'Marks a method/arrow as a **reactive effect** - it re-runs whenever the state it reads changes. Place above the member.',
    },
    {
        name: '#before-mount',
        detail: 'member → lifecycle: before mount',
        doc: 'Lifecycle hook: runs **before** the component mounts (before the first render). Place above a method.',
    },
    {
        name: '#mount',
        detail: 'member → lifecycle: on mount',
        doc: 'Lifecycle hook: runs **after** the component mounts (connected and first render done). Place above a method.',
    },
    {
        name: '#dispose',
        detail: 'member → lifecycle: on dispose',
        doc: 'Lifecycle hook: runs when the component is **disposed** (disconnected). Place above a method.',
    },
];

// Map a hover/cursor column on a `// #…` line to the hint token under it.
const hintAt = (
    line: string,
    column: number,
): { name: string; start: number; end: number } | null => {
    if (!/^\s*\/\/\s+#/.test(line)) return null;
    for (const m of line.matchAll(/#[\w-]+/g)) {
        const start = (m.index ?? 0) + 1;
        const end = start + m[0].length;
        if (column >= start && column <= end) {
            return { name: m[0], start, end };
        }
    }
    return null;
};

const registerHintCompletions = (): void => {
    const provider: monaco.languages.CompletionItemProvider = {
        triggerCharacters: ['#'],
        provideCompletionItems(model, position) {
            const before = model
                .getLineContent(position.lineNumber)
                .slice(0, position.column - 1);
            // a `// #…` hint comment; match the LAST `#token` being typed so
            // stacked hints on one line (`// #component #tag`) keep completing
            const m = before.match(/^\s*\/\/\s+#[\w-]*(\s+#[\w-]*)*$/)
                ? before.match(/(#?[\w-]*)$/)
                : before.match(/^\s*\/\/\s*(#?[\w-]*)$/);
            if (!m) return { suggestions: [] };

            const range = new monaco.Range(
                position.lineNumber,
                position.column - m[1].length,
                position.lineNumber,
                position.column,
            );

            return {
                suggestions: HINTS.map((h) => ({
                    label: h.name,
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    detail: h.detail,
                    documentation: { value: h.doc },
                    insertText: h.snippet ?? h.name,
                    insertTextRules: h.snippet
                        ? monaco.languages.CompletionItemInsertTextRule
                              .InsertAsSnippet
                        : undefined,
                    range,
                })),
            };
        },
    };
    monaco.languages.registerCompletionItemProvider('typescript', provider);
    monaco.languages.registerCompletionItemProvider('javascript', provider);
};

// Hover docs for compiler hints - same affordance as hovering a TS type.
const registerHintHovers = (): void => {
    const provider: monaco.languages.HoverProvider = {
        provideHover(model, position) {
            const line = model.getLineContent(position.lineNumber);
            const hit = hintAt(line, position.column);
            if (!hit) return null;
            const hint = HINTS.find((h) => h.name === hit.name);
            if (!hint) return null;
            return {
                range: new monaco.Range(
                    position.lineNumber,
                    hit.start,
                    position.lineNumber,
                    hit.end,
                ),
                contents: [
                    { value: `**${hint.name}** - elemix compiler hint` },
                    { value: hint.doc },
                ],
            };
        },
    };
    monaco.languages.registerHoverProvider('typescript', provider);
    monaco.languages.registerHoverProvider('javascript', provider);
};

const defineTheme = (): void => {
    monaco.editor.defineTheme('elemix-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: '', foreground: 'e7ecfb' },
            { token: 'comment', foreground: '6b7688', fontStyle: 'italic' },
            { token: 'keyword', foreground: '6aa3ff' },
            { token: 'keyword.flow', foreground: '6aa3ff' },
            { token: 'storage', foreground: '6aa3ff' },
            { token: 'string', foreground: '8ee7b0' },
            { token: 'string.escape', foreground: '4ca8ff' },
            { token: 'number', foreground: 'ffb37a' },
            { token: 'number.hex', foreground: 'ffb37a' },
            { token: 'regexp', foreground: 'f7768e' },
            { token: 'type', foreground: '4ec9b0' },
            { token: 'type.identifier', foreground: '4ec9b0' },
            { token: 'identifier', foreground: 'e7ecfb' },
            { token: 'delimiter', foreground: '7c89ad' },
            { token: 'delimiter.bracket', foreground: '7c89ad' },
            { token: 'delimiter.parenthesis', foreground: '7c89ad' },
            { token: 'operator', foreground: '7c89ad' },
            { token: 'annotation', foreground: 'ffd479' },
            { token: 'tag', foreground: 'ff7a93' },
            { token: 'attribute.name', foreground: '6aa3ff' },
            { token: 'attribute.binding', foreground: 'ffd479' },
            { token: 'attribute.value', foreground: '8ee7b0' },
            { token: 'attribute.value.unit', foreground: 'ffb37a' },
            { token: 'variable', foreground: 'ffd479' },
        ],
        colors: {
            'editor.background': '#060a16',
            'editor.foreground': '#e7ecfb',
            'editorLineNumber.foreground': '#2f3d5c',
            'editorLineNumber.activeForeground': '#8a9ac4',
            'editor.lineHighlightBackground': '#0b1326',
            'editor.lineHighlightBorder': '#00000000',
            'editor.selectionBackground': '#2e6bff40',
            'editor.inactiveSelectionBackground': '#2e6bff22',
            'editor.wordHighlightBackground': '#2e6bff26',
            'editorCursor.foreground': '#4ca8ff',
            'editorIndentGuide.background': '#17223f',
            'editorIndentGuide.activeBackground': '#2f3d5c',
            'editorWhitespace.foreground': '#1a2540',
            'editorGutter.background': '#060a16',
            'editorBracketMatch.background': '#4ca8ff2e',
            'editorBracketMatch.border': '#4ca8ff80',
            'editorWidget.background': '#0b1326',
            'editorWidget.border': '#17223f',
            'editorSuggestWidget.background': '#0b1326',
            'editorSuggestWidget.border': '#17223f',
            'editorSuggestWidget.selectedBackground': '#2e6bff33',
            'editorHoverWidget.background': '#0b1326',
            'editorHoverWidget.border': '#17223f',
            'minimap.background': '#060a16',
            'scrollbarSlider.background': '#2a3d6399',
            'scrollbarSlider.hoverBackground': '#3d5688',
            'scrollbarSlider.activeBackground': '#45608f',
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
    // Each load lives under a fresh directory so a disposed URI is never reused -
    // reusing `file:///main.ts` across examples leaves the TS worker with stale
    // diagnostics (wrong "Cannot find module" errors, misplaced squiggles).
    // Relative imports still resolve since every file shares the same prefix.
    let generation = 0;

    const buildModels = (files: Files): void => {
        for (const model of models.values()) model.dispose();
        models.clear();

        const dir = `gen${generation++}`;
        for (const [path, contents] of Object.entries(files)) {
            const uri = monaco.Uri.parse(`file:///${dir}/${path}`);
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
        revalidateTypeScript(models);
    };

    buildModels(initial);

    const firstModel = models.get(currentPath);
    if (!firstModel) throw new Error('createEditor: no files provided');

    const editor = monaco.editor.create(container, {
        model: firstModel,
        theme: 'elemix-dark',
        automaticLayout: true,
        minimap: { enabled: false },
        // compiler hints live in `// #…` comments; without this, completion never
        // auto-pops inside a comment (binding completion is fine - it's not a
        // comment token).
        quickSuggestions: { other: true, comments: true, strings: false },
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
        // The examples intentionally use typographic glyphs like U+2212 minus
        // (− buttons) and en/em dashes in copy - don't flag them as confusable.
        unicodeHighlight: {
            ambiguousCharacters: false,
            invisibleCharacters: false,
        },
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

// Models are created one at a time. With an already-warm TS worker (soft
// navigation between examples) the entry file gets validated before its siblings
// exist, leaving a stale "Cannot find module './App'" that never re-runs. Once
// every model is registered, force the worker to sync them all, then re-assert
// the diagnostics options so the whole set is re-validated with all imports
// resolvable. A cold reload doesn't need this - the worker boots after the
// models already exist.
// On a cold load the TS language mode registers asynchronously, so
// `getTypeScriptWorker()` rejects with "TypeScript not registered!" if called
// too early. Retry on a short backoff until the worker is available.
const resolveTsWorker = async (
    attempts = 40,
): Promise<
    Awaited<ReturnType<typeof monaco.typescript.getTypeScriptWorker>>
> => {
    try {
        return await monaco.typescript.getTypeScriptWorker();
    } catch (err) {
        if (attempts <= 0) throw err;
        await new Promise((resolve) => setTimeout(resolve, 50));
        return resolveTsWorker(attempts - 1);
    }
};

const revalidateTypeScript = (
    models: Map<string, monaco.editor.ITextModel>,
): void => {
    const tsUris = [...models.values()]
        .filter(
            (m) =>
                m.getLanguageId() === 'typescript' ||
                m.getLanguageId() === 'javascript',
        )
        .map((m) => m.uri);
    if (tsUris.length === 0) return;

    void resolveTsWorker()
        .then((getWorker) => getWorker(...tsUris))
        .then(() => {
            const ts = monaco.typescript.typescriptDefaults;
            ts.setDiagnosticsOptions(ts.getDiagnosticsOptions());
        })
        .catch(() => {});
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

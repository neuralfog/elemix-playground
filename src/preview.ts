import { ELEMIX_VERSION } from './generated/elemix-meta';

// Each entry maps to its own dist module. They share the reactive core via a
// common `./chunk.js` (resolved relative to these URLs), so the singletons stay
// shared — do NOT collapse them onto one bundle.
const importMap = (origin: string): string => {
    const base = `${origin}/elemix`;
    const v = ELEMIX_VERSION;
    const imports = {
        '@neuralfog/elemix': `${base}/index.mjs?v=${v}`,
        '@neuralfog/elemix/runtime': `${base}/runtime.mjs?v=${v}`,
        '@neuralfog/elemix/directives': `${base}/directives.mjs?v=${v}`,
    };
    return JSON.stringify({ imports }, null, 2);
};

const BOOTSTRAP = `
const fmt = (v) => {
    if (typeof v === 'string') return v;
    if (v instanceof Error) return v.stack || v.message;
    try { return JSON.stringify(v); } catch { return String(v); }
};
const send = (level, args) =>
    parent.postMessage({ __elemixPlayground: true, level, text: args.map(fmt).join(' ') }, '*');
for (const level of ['log', 'info', 'warn', 'error', 'debug']) {
    const orig = console[level].bind(console);
    console[level] = (...args) => { send(level, args); orig(...args); };
}
window.addEventListener('error', (e) => send('error', [e.error || e.message]));
window.addEventListener('unhandledrejection', (e) =>
    send('error', ['Unhandled rejection: ' + fmt(e.reason)]));
`;

export const buildDocument = (
    code: string,
    origin: string,
): string => `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<script type="importmap">
${importMap(origin)}
</script>
<style>
    body { margin: 16px; font-family: system-ui, sans-serif; color: #1e293b; }
</style>
<script>${BOOTSTRAP}</script>
</head>
<body>
<script type="module">
${code}
</script>
</body>
</html>`;

export type ConsoleLine = { level: string; text: string };

export const onPreviewMessage = (
    handler: (line: ConsoleLine) => void,
): (() => void) => {
    const listener = (e: MessageEvent): void => {
        const data = e.data;
        if (data?.__elemixPlayground) {
            handler({ level: data.level, text: data.text });
        }
    };
    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
};

export const renderPreview = (
    iframe: HTMLIFrameElement,
    code: string,
): void => {
    iframe.srcdoc = buildDocument(code, location.origin);
};

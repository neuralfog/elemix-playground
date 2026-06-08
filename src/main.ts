import { createEditor } from './editor';
import { compile } from './compiler';
import { onPreviewMessage, renderPreview } from './preview';
import { APPS, DEFAULT_APP, type App } from './files';
import { ELEMIX_VERSION } from './generated/elemix-meta';
import { TS_ICON, SASS_ICON } from './icons';

const $ = <T extends HTMLElement>(sel: string): T => {
    const el = document.querySelector<T>(sel);
    if (!el) throw new Error(`Missing element: ${sel}`);
    return el;
};

const editorEl = $('#editor');
const fileTreeEl = $('#filetree');
const tabsEl = $('#tabs');
const previewIframe = $<HTMLIFrameElement>('#preview');
const consoleEl = $('#console');
const runBtn = $<HTMLButtonElement>('#run-btn');
const autoRunInput = $<HTMLInputElement>('#auto-run');

$('#brand-version').textContent = `v${ELEMIX_VERSION}`;

const appFromHash = (): App => {
    const id = location.hash.replace(/^#/, '');
    return APPS.find((a) => a.id === id) ?? DEFAULT_APP;
};

const initialApp = appFromHash();
const editor = createEditor(editorEl, initialApp.files);

type Icon = { svg: string } | { text: string; cls: string };

const iconFor = (path: string): Icon => {
    if (path.endsWith('.ts') || path.endsWith('.tsx')) return { svg: TS_ICON };
    if (path.endsWith('.scss') || path.endsWith('.sass'))
        return { svg: SASS_ICON };
    if (path.endsWith('.js') || path.endsWith('.jsx'))
        return { text: 'JS', cls: 'icon-js' };
    if (path.endsWith('.css')) return { text: '#', cls: 'icon-css' };
    if (path.endsWith('.json')) return { text: '{}', cls: 'icon-json' };
    if (path.endsWith('.html')) return { text: '<>', cls: 'icon-html' };
    return { text: '·', cls: 'icon-default' };
};

const makeEntry = (
    tag: 'file-item' | 'tab',
    path: string,
): HTMLButtonElement => {
    const btn = document.createElement('button');
    btn.className = `${tag}${path === editor.current() ? ' active' : ''}`;

    const icon = iconFor(path);
    const iconEl = document.createElement('span');
    if ('svg' in icon) {
        iconEl.className = 'file-icon file-icon--svg';
        iconEl.innerHTML = icon.svg;
    } else {
        iconEl.className = `file-icon ${icon.cls}`;
        iconEl.textContent = icon.text;
    }

    const label = document.createElement('span');
    label.className = 'file-label';
    label.textContent = path;

    btn.append(iconEl, label);
    btn.onclick = () => {
        editor.open(path);
        renderFileTree();
        renderTabs();
    };
    return btn;
};

const renderFileTree = (): void => {
    fileTreeEl.innerHTML = '<div class="filetree-title">Files</div>';
    for (const path of editor.paths()) {
        fileTreeEl.appendChild(makeEntry('file-item', path));
    }
};

const renderTabs = (): void => {
    tabsEl.innerHTML = '';
    for (const path of editor.paths()) {
        tabsEl.appendChild(makeEntry('tab', path));
    }
};

const appSelect = $('#app-select');
const appTrigger = $<HTMLButtonElement>('#app-trigger');
const appCurrent = $('#app-current');
const appMenu = $('#app-menu');

let currentAppId = initialApp.id;

const openMenu = (open: boolean): void => {
    appMenu.hidden = !open;
    appTrigger.setAttribute('aria-expanded', String(open));
    appSelect.classList.toggle('open', open);
};

const selectApp = (app: App): void => {
    openMenu(false);
    if (app.id === currentAppId) return;
    currentAppId = app.id;
    location.hash = app.id;
    appCurrent.textContent = app.name;
    editor.load(app.files);
    renderFileTree();
    renderTabs();
    renderAppMenu();
    void run();
};

const renderAppMenu = (): void => {
    appMenu.innerHTML = '';
    for (const app of APPS) {
        const item = document.createElement('button');
        item.className = `app-option${app.id === currentAppId ? ' active' : ''}`;
        item.setAttribute('role', 'option');

        const name = document.createElement('span');
        name.textContent = app.name;

        const check = document.createElement('span');
        check.className = 'app-check';
        check.textContent = app.id === currentAppId ? '✓' : '';

        item.append(name, check);
        item.onclick = () => selectApp(app);
        appMenu.appendChild(item);
    }
};

appTrigger.onclick = (e) => {
    e.stopPropagation();
    openMenu(appMenu.hidden === true);
};
document.addEventListener('click', (e) => {
    if (!appSelect.contains(e.target as Node)) openMenu(false);
});
window.addEventListener('hashchange', () => {
    const app = appFromHash();
    if (app.id !== currentAppId) selectApp(app);
});

appCurrent.textContent = initialApp.name;
renderAppMenu();

const consoleCountEl = $('#console-count');
const clearConsoleBtn = $<HTMLButtonElement>('#clear-console');
const consolePanel = $('#console-panel');
const consoleDivider = $('#console-divider');
const toggleConsoleBtn = $<HTMLButtonElement>('#toggle-console');
const previewPaneEl = $('#preview-pane');

let consoleCollapsed = false;
let consoleFlex = '0 0 168px';

const setConsoleCollapsed = (collapsed: boolean): void => {
    consoleCollapsed = collapsed;
    consolePanel.classList.toggle('collapsed', collapsed);
    consoleDivider.style.display = collapsed ? 'none' : '';
    consolePanel.style.flex = collapsed ? '0 0 auto' : consoleFlex;
    toggleConsoleBtn.textContent = collapsed ? '▴' : '▾';
    toggleConsoleBtn.title = collapsed ? 'Show console' : 'Hide console';
};

toggleConsoleBtn.onclick = () => setConsoleCollapsed(!consoleCollapsed);

const LEVEL_GLYPH: Record<string, string> = {
    log: '›',
    info: 'ⓘ',
    debug: '›',
    warn: '⚠',
    error: '✕',
};

let messageCount = 0;

const setEmptyState = (): void => {
    consoleEl.innerHTML =
        '<div class="console-empty">Console output will appear here.</div>';
};

const clearConsole = (): void => {
    messageCount = 0;
    consoleCountEl.textContent = '';
    setEmptyState();
};

const logLine = (level: string, text: string): void => {
    if (messageCount === 0) consoleEl.innerHTML = '';
    messageCount++;
    consoleCountEl.textContent = String(messageCount);

    const line = document.createElement('div');
    line.className = `console-line console-${level}`;

    const glyph = document.createElement('span');
    glyph.className = 'console-glyph';
    glyph.textContent = LEVEL_GLYPH[level] ?? '›';

    const msg = document.createElement('span');
    msg.className = 'console-msg';
    msg.textContent = text;

    line.append(glyph, msg);
    consoleEl.appendChild(line);
    consoleEl.scrollTop = consoleEl.scrollHeight;
};

clearConsoleBtn.onclick = clearConsole;
setEmptyState();

onPreviewMessage(({ level, text }) => logLine(level, text));

let building = false;
let queued = false;

const run = async (): Promise<void> => {
    if (building) {
        queued = true;
        return;
    }
    building = true;
    runBtn.disabled = true;
    runBtn.textContent = 'Running…';
    clearConsole();

    const result = await compile(editor.files());
    if (result.ok) {
        for (const w of result.warnings) logLine('warn', w);
        renderPreview(previewIframe, result.code);
    } else {
        for (const e of result.errors) logLine('error', e);
    }

    building = false;
    runBtn.disabled = false;
    runBtn.textContent = 'Run';
    if (queued) {
        queued = false;
        void run();
    }
};

let debounce: number | undefined;
editor.onChange(() => {
    if (!autoRunInput.checked) return;
    clearTimeout(debounce);
    debounce = window.setTimeout(() => void run(), 600);
});

runBtn.onclick = () => void run();
window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        void run();
    }
});

const setupDivider = (): void => {
    const divider = $('#divider');
    const editorPane = $('#editor-pane');
    const workspace = $('#workspace');
    const MIN = 240;
    let dragging = false;

    const onMove = (e: PointerEvent): void => {
        if (!dragging) return;
        const rect = workspace.getBoundingClientRect();
        const treeWidth = fileTreeEl.getBoundingClientRect().width;
        const dividerWidth = divider.getBoundingClientRect().width;
        const max = rect.width - treeWidth - dividerWidth - MIN;
        const w = Math.max(
            MIN,
            Math.min(e.clientX - rect.left - treeWidth, max),
        );
        editorPane.style.flex = `0 0 ${w}px`;
        editor.layout();
    };

    const stop = (e: PointerEvent): void => {
        if (!dragging) return;
        dragging = false;
        divider.releasePointerCapture(e.pointerId);
        previewIframe.style.pointerEvents = '';
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
        editor.layout();
    };

    divider.addEventListener('pointerdown', (e) => {
        dragging = true;
        divider.setPointerCapture(e.pointerId);
        previewIframe.style.pointerEvents = 'none';
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'col-resize';
        e.preventDefault();
    });
    divider.addEventListener('pointermove', onMove);
    divider.addEventListener('pointerup', stop);
    divider.addEventListener('pointercancel', stop);
};

const setupConsoleDivider = (): void => {
    const MIN = 90;
    let dragging = false;

    const onMove = (e: PointerEvent): void => {
        if (!dragging) return;
        const rect = previewPaneEl.getBoundingClientRect();
        const max = rect.height - 140;
        const h = Math.max(MIN, Math.min(rect.bottom - e.clientY, max));
        consoleFlex = `0 0 ${h}px`;
        consolePanel.style.flex = consoleFlex;
    };

    const stop = (e: PointerEvent): void => {
        if (!dragging) return;
        dragging = false;
        consoleDivider.releasePointerCapture(e.pointerId);
        previewIframe.style.pointerEvents = '';
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
    };

    consoleDivider.addEventListener('pointerdown', (e) => {
        if (consoleCollapsed) return;
        dragging = true;
        consoleDivider.setPointerCapture(e.pointerId);
        previewIframe.style.pointerEvents = 'none';
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'row-resize';
        e.preventDefault();
    });
    consoleDivider.addEventListener('pointermove', onMove);
    consoleDivider.addEventListener('pointerup', stop);
    consoleDivider.addEventListener('pointercancel', stop);
};

setupDivider();
setupConsoleDivider();
renderFileTree();
renderTabs();
void run();

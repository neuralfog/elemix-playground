export type Files = Record<string, string>;

export interface App {
    id: string;
    name: string;
    files: Files;
}

export const ENTRY = 'main.ts';

const counterMain = `import './CounterApp';

document.body.insertAdjacentHTML('beforeend', '<counter-app></counter-app>');
`;

const todoMain = `import './TodoApp';

document.body.insertAdjacentHTML('beforeend', '<todo-app></todo-app>');
`;

const counterTs = `import { Component, defineComponent, html, type Template } from '@neuralfog/elemix';
import { state } from '@neuralfog/elemix/state';
import css from './CounterApp.scss?inline';

type State = {
    count: number;
};

export class CounterApp extends Component {
    static styles = [css];

    state = state<State>({ count: 0 });

    increment = (): void => {
        this.state.count++;
    };

    template = (): Template => html\`
        <button @click=\${this.increment}>count is \${this.state.count}</button>
    \`;
}

defineComponent('counter-app', CounterApp);
`;

const todoTs = `import { Component, defineComponent, html, type Template } from '@neuralfog/elemix';
import { state } from '@neuralfog/elemix/state';
import { repeat } from '@neuralfog/elemix/directives';
import { ref, type Ref } from '@neuralfog/elemix/utilities';

import css from './TodoApp.scss?inline';

type Todo = { id: string; text: string };

type State = {
    draft: Ref<string>;
    todos: Todo[];
};

export class TodoApp extends Component {
    static styles = [css];

    state = state<State>({
        draft: ref(''),
        todos: [{ id: crypto.randomUUID(), text: 'Learn Elemix' }],
    });

    addItem = (): void => {
        const value = this.state.draft.value.trim();
        if (!value) return;
        this.state.todos.push({ id: crypto.randomUUID(), text: value });
        this.state.draft.value = '';
    };

    removeItem = (id: string): void => {
        const index = this.state.todos.findIndex((todo) => todo.id === id);
        if (index !== -1) this.state.todos.splice(index, 1);
    };

    template = (): Template => html\`
        <h3>Todos</h3>
        <div class="row">
            <input
                type="text"
                placeholder="What needs doing?"
                ~model=\${this.state.draft}
                @keydown=\${(e: KeyboardEvent) => {
                    if (e.key === 'Enter') this.addItem();
                }}
            />
            <button class="add" @click=\${this.addItem}>Add</button>
        </div>
        <ul>
            \${repeat(
                this.state.todos,
                (todo) => html\`
                    <li>
                        <span>\${todo.text}</span>
                        <button class="remove" @click=\${() => this.removeItem(todo.id)}>×</button>
                    </li>
                \`,
                (todo) => todo.id,
            )}
        </ul>
    \`;
}

defineComponent('todo-app', TodoApp);
`;

const todoScss = `:host {
    --accent: #6366f1;
    --accent-hover: #4f46e5;
    --danger: #ef4444;
    --surface: #f1f5f9;
    --border: #cbd5e1;
    --text: #1e293b;

    display: block;
    margin-bottom: 24px;
    font-family: system-ui, sans-serif;
    color: var(--text);
}

h3 {
    margin: 0 0 12px;
}

.row {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
}

input {
    flex: 1;
    font: inherit;
    padding: 8px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    outline: none;

    &:focus {
        border-color: var(--accent);
    }
}

button {
    font: inherit;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}

.add {
    padding: 8px 16px;
    background: var(--accent);
    color: white;

    &:hover {
        background: var(--accent-hover);
    }
}

ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    background: var(--surface);
    border-radius: 8px;
}

.remove {
    width: 26px;
    height: 26px;
    display: grid;
    place-items: center;
    background: transparent;
    color: var(--danger);
    font-size: 18px;
    line-height: 1;

    &:hover {
        background: rgba(239, 68, 68, 0.12);
    }
}
`;

const counterScss = `:host {
    --accent: #6366f1;
    --accent-hover: #4f46e5;

    display: block;
    margin-bottom: 24px;
    font-family: system-ui, sans-serif;
}

button {
    font: inherit;
    padding: 8px 18px;
    border-radius: 10px;
    border: 1px solid var(--accent);
    background: var(--accent);
    color: white;
    cursor: pointer;
    transition: background 0.15s ease;

    &:hover {
        background: var(--accent-hover);
    }
}
`;

const profileMain = `import './ProfileApp';

document.body.insertAdjacentHTML('beforeend', '<profile-app></profile-app>');
`;

const profileAppTs = `import { Component, defineComponent, html, type Template } from '@neuralfog/elemix';
import { state } from '@neuralfog/elemix/state';
import { ref, type Ref } from '@neuralfog/elemix/utilities';

import css from './ProfileApp.scss?inline';

import './ProfileCard';

type State = {
    name: Ref<string>;
    role: Ref<string>;
    likes: number;
};

export class ProfileApp extends Component {
    static styles = [css];

    state = state<State>({
        name: ref('Ada Lovelace'),
        role: ref('Engineer'),
        likes: 0,
    });

    like = (): void => {
        this.state.likes++;
    };

    template = (): Template => html\`
        <div class="controls">
            <label>
                Name
                <input type="text" ~model=\${this.state.name} />
            </label>
            <label>
                Role
                <input type="text" ~model=\${this.state.role} />
            </label>
            <button @click=\${this.like}>👍 Like</button>
        </div>
        <profile-card
            :name=\${this.state.name.value}
            :role=\${this.state.role.value}
            :likes=\${this.state.likes}
        />
    \`;
}

defineComponent('profile-app', ProfileApp);
`;

const profileCardTs = `import { Component, defineComponent, html, type Template } from '@neuralfog/elemix';

import css from './ProfileCard.scss?inline';

type Props = {
    name: string;
    role: string;
    likes: number;
};

export class ProfileCard extends Component<Props> {
    static styles = [css];

    template = (): Template => html\`<div class="card">
        <div class="avatar">\${this.props.name.charAt(0)}</div>
        <div class="info">
            <strong>\${this.props.name}</strong>
            <span>\${this.props.role}</span>
        </div>
        <div class="likes">❤️ \${this.props.likes}</div>
    </div>\`;
}

defineComponent('profile-card', ProfileCard);
`;

const profileAppScss = `:host {
    --accent: #6366f1;
    display: block;
    font-family: system-ui, sans-serif;
}

.controls {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: flex-end;
    margin-bottom: 20px;
}

label {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 12px;
    color: #64748b;
}

input {
    font: inherit;
    font-size: 14px;
    padding: 7px 10px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    outline: none;

    &:focus {
        border-color: var(--accent);
    }
}

button {
    font: inherit;
    padding: 8px 14px;
    border: none;
    border-radius: 8px;
    background: var(--accent);
    color: white;
    cursor: pointer;

    &:hover {
        background: #4f46e5;
    }
}
`;

const profileCardScss = `:host {
    display: block;
    font-family: system-ui, sans-serif;
}

.card {
    display: flex;
    align-items: center;
    gap: 14px;
    max-width: 360px;
    padding: 16px;
    border-radius: 14px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
}

.avatar {
    flex: 0 0 48px;
    height: 48px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    font-size: 20px;
    font-weight: 700;
}

.info {
    display: flex;
    flex-direction: column;
}

.info strong {
    font-size: 16px;
}

.info span {
    font-size: 13px;
    opacity: 0.85;
}

.likes {
    margin-left: auto;
    font-size: 15px;
    font-weight: 600;
}
`;

const storeMain = `import './StoreApp';

document.body.insertAdjacentHTML('beforeend', '<store-app></store-app>');
`;

const storeAppTs = `import { Component, defineComponent, html, type Template } from '@neuralfog/elemix';
import { state } from '@neuralfog/elemix/state';

import css from './StoreApp.scss?inline';

import './StoreControls';

type State = {
    counter: { value: number };
};

export class StoreApp extends Component {
    static styles = [css];

    state = state<State>({
        counter: { value: 0 },
    });

    template = (): Template => html\`
        <p class="note">
            The <code>counter</code> object lives in this parent's reactive
            state and is passed down as a prop. Objects are shared by reference,
            so when the child mutates <code>this.props.counter.value</code>,
            every component subscribed to that object re-renders — including
            this parent.
        </p>
        <div class="readout">
            Parent reads: <strong>\${this.state.counter.value}</strong>
        </div>
        <store-controls :counter=\${this.state.counter} />
    \`;
}

defineComponent('store-app', StoreApp);
`;

const storeControlsTs = `import { Component, defineComponent, html, type Template } from '@neuralfog/elemix';

import css from './StoreControls.scss?inline';

type Props = {
    counter: { value: number };
};

export class StoreControls extends Component<Props> {
    static styles = [css];

    dec = (): void => {
        this.props.counter.value--;
    };

    inc = (): void => {
        this.props.counter.value++;
    };

    template = (): Template => html\`<div class="panel">
        <span class="label">Child controls</span>
        <div class="buttons">
            <button @click=\${this.dec}>−</button>
            <span class="value">\${this.props.counter.value}</span>
            <button @click=\${this.inc}>+</button>
        </div>
    </div>\`;
}

defineComponent('store-controls', StoreControls);
`;

const storeAppScss = `:host {
    --accent: #6366f1;
    display: block;
    max-width: 460px;
    font-family: system-ui, sans-serif;
    color: #1e293b;
}

.note {
    margin: 0 0 18px;
    padding: 12px 14px;
    font-size: 13px;
    line-height: 1.6;
    color: #475569;
    background: #f1f5f9;
    border-left: 3px solid var(--accent);
    border-radius: 8px;
}

code {
    font-family: ui-monospace, monospace;
    font-size: 12px;
    background: #e2e8f0;
    padding: 1px 5px;
    border-radius: 4px;
}

.readout {
    margin-bottom: 16px;
    font-size: 15px;
}

.readout strong {
    font-size: 22px;
    color: var(--accent);
}
`;

const storeControlsScss = `:host {
    display: block;
    font-family: system-ui, sans-serif;
}

.panel {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 16px;
    border: 1px dashed #cbd5e1;
    border-radius: 12px;
}

.label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #94a3b8;
}

.buttons {
    display: flex;
    align-items: center;
    gap: 14px;
}

button {
    width: 38px;
    height: 38px;
    font-size: 20px;
    border: none;
    border-radius: 10px;
    background: var(--accent, #6366f1);
    color: white;
    cursor: pointer;

    &:hover {
        background: #4f46e5;
    }
}

.value {
    min-width: 32px;
    font-size: 22px;
    font-weight: 700;
    text-align: center;
}
`;

const signalMain = `import './SignalApp';

document.body.insertAdjacentHTML('beforeend', '<signal-app></signal-app>');
`;

const signalStoreTs = `import { signal } from '@neuralfog/elemix/signal';

export const counter = signal({ count: 0 });
`;

const signalAppTs = `import { Component, defineComponent, html, type Template } from '@neuralfog/elemix';

import css from './SignalApp.scss?inline';

import './SignalValue';
import './SignalButtons';

export class SignalApp extends Component {
    static styles = [css];

    template = (): Template => html\`
        <p class="note">
            A <code>signal</code> is a reactive store created in its own module
            (<code>store.ts</code>) and imported wherever it is needed. The two
            components below are siblings with no props between them — yet the
            buttons in one update the number shown in the other, because both
            subscribe to the same signal.
        </p>
        <signal-value />
        <signal-buttons />
    \`;
}

defineComponent('signal-app', SignalApp);
`;

const signalValueTs = `import { Component, defineComponent, html, type Template } from '@neuralfog/elemix';

import css from './SignalValue.scss?inline';

import { counter } from './store';

export class SignalValue extends Component {
    static styles = [css];

    template = (): Template => html\`<div class="value">\${counter.value.count}</div>\`;
}

defineComponent('signal-value', SignalValue);
`;

const signalButtonsTs = `import { Component, defineComponent, html, type Template } from '@neuralfog/elemix';

import css from './SignalButtons.scss?inline';

import { counter } from './store';

export class SignalButtons extends Component {
    static styles = [css];

    dec = (): void => {
        counter.value.count--;
    };

    reset = (): void => {
        counter.value.count = 0;
    };

    inc = (): void => {
        counter.value.count++;
    };

    template = (): Template => html\`<div class="buttons">
        <button @click=\${this.dec}>−</button>
        <button @click=\${this.reset}>Reset</button>
        <button @click=\${this.inc}>+</button>
    </div>\`;
}

defineComponent('signal-buttons', SignalButtons);
`;

const signalAppScss = `:host {
    --accent: #6366f1;
    display: block;
    max-width: 440px;
    font-family: system-ui, sans-serif;
    color: #1e293b;
    text-align: center;
}

.note {
    margin: 0 0 20px;
    padding: 12px 14px;
    font-size: 13px;
    line-height: 1.6;
    text-align: left;
    color: #475569;
    background: #f1f5f9;
    border-left: 3px solid var(--accent);
    border-radius: 8px;
}

code {
    font-family: ui-monospace, monospace;
    font-size: 12px;
    background: #e2e8f0;
    padding: 1px 5px;
    border-radius: 4px;
}
`;

const signalValueScss = `:host {
    display: block;
    font-family: system-ui, sans-serif;
}

.value {
    margin-bottom: 16px;
    font-size: 64px;
    font-weight: 800;
    line-height: 1;
    text-align: center;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
}
`;

const signalButtonsScss = `:host {
    display: block;
    font-family: system-ui, sans-serif;
}

.buttons {
    display: flex;
    justify-content: center;
    gap: 10px;
}

button {
    font: inherit;
    font-size: 16px;
    min-width: 48px;
    padding: 10px 18px;
    border: none;
    border-radius: 10px;
    background: #6366f1;
    color: white;
    cursor: pointer;

    &:hover {
        background: #4f46e5;
    }
}
`;

const modelMain = `import './ModelApp';

document.body.insertAdjacentHTML('beforeend', '<model-app></model-app>');
`;

const modelAppTs = `import { Component, defineComponent, html, type Template } from '@neuralfog/elemix';
import { state } from '@neuralfog/elemix/state';
import { ref, type Ref } from '@neuralfog/elemix/utilities';

import css from './ModelApp.scss?inline';

const clamp = (v: string): string => {
    const n = Number(v);
    return String(Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 0);
};

type State = {
    name: Ref<string>;
    volume: Ref<string>;
};

export class ModelApp extends Component {
    static styles = [css];

    state = state<State>({
        name: ref('Ada'),
        volume: ref('50'),
    });

    template = (): Template => html\`
        <p class="note">
            <code>~model</code> two-way binds an input to a ref.
            <code>~onmodel</code> runs a transform on every keystroke before the
            value is stored — here it clamps the number to 0–100.
        </p>

        <label>
            Name (<code>~model</code>)
            <input type="text" ~model=\${this.state.name} />
        </label>
        <div class="out">Hello, \${this.state.name.value || '…'}</div>

        <label>
            Volume (<code>~model</code> + <code>~onmodel</code>, clamped 0–100)
            <input type="text" ~model=\${this.state.volume} ~onmodel=\${clamp} />
        </label>
        <div class="out">Volume: \${this.state.volume.value}</div>
    \`;
}

defineComponent('model-app', ModelApp);
`;

const modelAppScss = `:host {
    --accent: #6366f1;
    display: block;
    max-width: 420px;
    font-family: system-ui, sans-serif;
    color: #1e293b;
}

.note {
    margin: 0 0 20px;
    padding: 12px 14px;
    font-size: 13px;
    line-height: 1.6;
    color: #475569;
    background: #f1f5f9;
    border-left: 3px solid var(--accent);
    border-radius: 8px;
}

code {
    font-family: ui-monospace, monospace;
    font-size: 12px;
    background: #e2e8f0;
    padding: 1px 5px;
    border-radius: 4px;
}

label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 8px;
    font-size: 13px;
    color: #475569;
}

input {
    font: inherit;
    font-size: 15px;
    padding: 9px 12px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    outline: none;

    &:focus {
        border-color: var(--accent);
    }
}

.out {
    margin-bottom: 20px;
    font-size: 15px;
    font-weight: 600;
    color: var(--accent);
}

.out:last-child {
    margin-bottom: 0;
}
`;

const chatMain = `import './ChatApp';

document.body.insertAdjacentHTML('beforeend', '<chat-app></chat-app>');
`;

const chatAppTs = `import { Component, defineComponent, html, type Template } from '@neuralfog/elemix';
import { state } from '@neuralfog/elemix/state';
import { repeat } from '@neuralfog/elemix/directives';
import { ref, type Ref } from '@neuralfog/elemix/utilities';

import css from './ChatApp.scss?inline';

type Message = { id: string; text: string; me: boolean };

type State = {
    draft: Ref<string>;
    messages: Message[];
};

export class ChatApp extends Component {
    static styles = [css];

    state = state<State>({
        draft: ref(''),
        messages: [
            { id: crypto.randomUUID(), text: 'Hey there 👋', me: false },
            { id: crypto.randomUUID(), text: 'This log auto-scrolls.', me: false },
            { id: crypto.randomUUID(), text: 'Send a few messages and watch.', me: false },
        ],
    });

    send = (): void => {
        const text = this.state.draft.value.trim();
        if (!text) return;
        this.state.messages.push({ id: crypto.randomUUID(), text, me: true });
        this.state.draft.value = '';
    };

    onMutation(): void {
        const log = this.root?.querySelector('.log');
        if (log) log.scrollTop = log.scrollHeight;
    }

    template = (): Template => html\`
        <p class="note">
            Elemix batches renders asynchronously, so a new message is not in the
            DOM yet inside <code>send()</code>. <code>onMutation()</code> fires
            right after the DOM is written, making it the correct place to scroll
            this log to the bottom.
        </p>
        <div class="log">
            \${repeat(
                this.state.messages,
                (m) => html\`<div .class=\${{ msg: true, me: m.me }}>\${m.text}</div>\`,
                (m) => m.id,
            )}
        </div>
        <div class="composer">
            <input
                type="text"
                placeholder="Type a message…"
                ~model=\${this.state.draft}
                @keydown=\${(e: KeyboardEvent) => {
                    if (e.key === 'Enter') this.send();
                }}
            />
            <button @click=\${this.send}>Send</button>
        </div>
    \`;
}

defineComponent('chat-app', ChatApp);
`;

const chatAppScss = `:host {
    --accent: #6366f1;
    display: block;
    max-width: 400px;
    font-family: system-ui, sans-serif;
    color: #1e293b;
}

.note {
    margin: 0 0 16px;
    padding: 12px 14px;
    font-size: 13px;
    line-height: 1.6;
    color: #475569;
    background: #f1f5f9;
    border-left: 3px solid var(--accent);
    border-radius: 8px;
}

code {
    font-family: ui-monospace, monospace;
    font-size: 12px;
    background: #e2e8f0;
    padding: 1px 5px;
    border-radius: 4px;
}

.log {
    display: flex;
    flex-direction: column;
    gap: 8px;
    height: 180px;
    overflow-y: auto;
    padding: 12px;
    margin-bottom: 12px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
}

.msg {
    align-self: flex-start;
    max-width: 80%;
    padding: 8px 12px;
    font-size: 14px;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
}

.msg.me {
    align-self: flex-end;
    background: var(--accent);
    color: white;
    border-color: transparent;
}

.composer {
    display: flex;
    gap: 8px;
}

input {
    flex: 1;
    font: inherit;
    padding: 9px 12px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    outline: none;

    &:focus {
        border-color: var(--accent);
    }
}

button {
    font: inherit;
    padding: 9px 16px;
    border: none;
    border-radius: 8px;
    background: var(--accent);
    color: white;
    cursor: pointer;

    &:hover {
        background: #4f46e5;
    }
}
`;

const renderMain = `import './RenderApp';

document.body.insertAdjacentHTML('beforeend', '<render-app></render-app>');
`;

const renderAppTs = `import { Component, defineComponent, html, type Template } from '@neuralfog/elemix';

import css from './RenderApp.scss?inline';

export class RenderApp extends Component {
    static styles = [css];

    count = 0;

    silent = (): void => {
        this.count++;
    };

    withRender = (): void => {
        this.count++;
        this.render();
    };

    template = (): Template => html\`
        <p class="note">
            <code>count</code> here is a plain field, not reactive state, so
            mutating it does not re-render. "Increment (silent)" changes the
            value behind the scenes; "Increment + render()" calls
            <code>this.render()</code> to manually flush it to the DOM — watch the
            silent increments catch up. This is ideal when you want full manual
            control over rendering, driving updates yourself without reactive
            state getting in the way.
        </p>
        <div class="value">\${this.count}</div>
        <div class="buttons">
            <button class="ghost" @click=\${this.silent}>Increment (silent)</button>
            <button @click=\${this.withRender}>Increment + render()</button>
        </div>
    \`;
}

defineComponent('render-app', RenderApp);
`;

const renderAppScss = `:host {
    --accent: #6366f1;
    display: block;
    max-width: 440px;
    font-family: system-ui, sans-serif;
    color: #1e293b;
}

.note {
    margin: 0 0 20px;
    padding: 12px 14px;
    font-size: 13px;
    line-height: 1.6;
    color: #475569;
    background: #f1f5f9;
    border-left: 3px solid var(--accent);
    border-radius: 8px;
}

code {
    font-family: ui-monospace, monospace;
    font-size: 12px;
    background: #e2e8f0;
    padding: 1px 5px;
    border-radius: 4px;
}

.value {
    margin-bottom: 18px;
    font-size: 56px;
    font-weight: 800;
    line-height: 1;
    color: var(--accent);
}

.buttons {
    display: flex;
    gap: 10px;
}

button {
    font: inherit;
    padding: 9px 16px;
    border: none;
    border-radius: 8px;
    background: var(--accent);
    color: white;
    cursor: pointer;

    &:hover {
        background: #4f46e5;
    }
}

button.ghost {
    background: #e2e8f0;
    color: #475569;

    &:hover {
        background: #cbd5e1;
    }
}
`;

const directMain = `import './DirectApp';

document.body.insertAdjacentHTML('beforeend', '<direct-app></direct-app>');
`;

const directAppTs = `import { Component, defineComponent, html, type Template } from '@neuralfog/elemix';
import { state } from '@neuralfog/elemix/state';

import css from './DirectApp.scss?inline';

type Toggle = 'active' | 'rounded' | 'large' | 'disabled';

type State = {
    active: boolean;
    rounded: boolean;
    large: boolean;
    disabled: boolean;
};

export class DirectApp extends Component {
    static styles = [css];

    state = state<State>({
        active: true,
        rounded: false,
        large: false,
        disabled: false,
    });

    toggle = (key: Toggle): void => {
        this.state[key] = !this.state[key];
    };

    template = (): Template => html\`
        <p class="note">
            The <code>.</code> prefix binds directly to the element.
            <code>.class={...}</code> toggles classes from an object, while
            <code>.prop</code> sets a real DOM property (like <code>.checked</code>
            or <code>.disabled</code>) instead of an attribute.
        </p>

        <div
            .class=\${{
                box: true,
                active: this.state.active,
                rounded: this.state.rounded,
                large: this.state.large,
            }}
        >
            .class
        </div>

        <div class="toggles">
            <button @click=\${() => this.toggle('active')}>active</button>
            <button @click=\${() => this.toggle('rounded')}>rounded</button>
            <button @click=\${() => this.toggle('large')}>large</button>
        </div>

        <label class="prop-demo">
            <input
                type="checkbox"
                .checked=\${this.state.disabled}
                @change=\${() => this.toggle('disabled')}
            />
            Disable the button (<code>.disabled</code>)
        </label>
        <button class="action" .disabled=\${this.state.disabled}>Action</button>
    \`;
}

defineComponent('direct-app', DirectApp);
`;

const directAppScss = `:host {
    --accent: #6366f1;
    display: block;
    max-width: 440px;
    font-family: system-ui, sans-serif;
    color: #1e293b;
}

.note {
    margin: 0 0 20px;
    padding: 12px 14px;
    font-size: 13px;
    line-height: 1.6;
    color: #475569;
    background: #f1f5f9;
    border-left: 3px solid var(--accent);
    border-radius: 8px;
}

code {
    font-family: ui-monospace, monospace;
    font-size: 12px;
    background: #e2e8f0;
    padding: 1px 5px;
    border-radius: 4px;
}

.box {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 140px;
    height: 80px;
    margin-bottom: 14px;
    font-size: 13px;
    font-weight: 600;
    color: #475569;
    background: #e2e8f0;
    transition: all 0.2s ease;
}

.box.active {
    background: var(--accent);
    color: white;
}

.box.rounded {
    border-radius: 18px;
}

.box.large {
    width: 210px;
    height: 110px;
    font-size: 16px;
}

.toggles {
    display: flex;
    gap: 8px;
    margin-bottom: 22px;
}

.toggles button {
    font: inherit;
    font-size: 13px;
    padding: 7px 14px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    background: white;
    color: #475569;
    cursor: pointer;

    &:hover {
        border-color: var(--accent);
        color: var(--accent);
    }
}

.prop-demo {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    font-size: 14px;
    color: #475569;
}

.action {
    font: inherit;
    padding: 9px 18px;
    border: none;
    border-radius: 8px;
    background: var(--accent);
    color: white;
    cursor: pointer;

    &:hover:not(:disabled) {
        background: #4f46e5;
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
}
`;

const conditionalMain = `import './ConditionalApp';

document.body.insertAdjacentHTML('beforeend', '<conditional-app></conditional-app>');
`;

const conditionalAppTs = `import { Component, defineComponent, html, type Template } from '@neuralfog/elemix';
import { state } from '@neuralfog/elemix/state';

import css from './ConditionalApp.scss?inline';

type State = {
    loggedIn: boolean;
    showTip: boolean;
};

export class ConditionalApp extends Component {
    static styles = [css];

    state = state<State>({
        loggedIn: false,
        showTip: true,
    });

    toggleLogin = (): void => {
        this.state.loggedIn = !this.state.loggedIn;
    };

    toggleTip = (): void => {
        this.state.showTip = !this.state.showTip;
    };

    template = (): Template => html\`
        <p class="note">
            Conditionals are just JavaScript in the template. A ternary swaps
            between two templates; a ternary with an empty branch
            (<code>: ''</code>) renders nothing.
        </p>

        <div class="panel">
            \${
                this.state.loggedIn
                    ? html\`<div class="card welcome">
                          <strong>Welcome back! 🎉</strong>
                          <span>You are signed in.</span>
                      </div>\`
                    : html\`<div class="card guest">
                          <strong>You are signed out</strong>
                          <span>Sign in to see your dashboard.</span>
                      </div>\`
            }

            \${
                this.state.showTip
                    ? html\`<div class="tip">💡 Toggle the buttons to watch each branch mount and unmount.</div>\`
                    : ''
            }
        </div>

        <div class="buttons">
            <button @click=\${this.toggleLogin}>
                \${this.state.loggedIn ? 'Sign out' : 'Sign in'}
            </button>
            <button class="ghost" @click=\${this.toggleTip}>
                \${this.state.showTip ? 'Hide tip' : 'Show tip'}
            </button>
        </div>
    \`;
}

defineComponent('conditional-app', ConditionalApp);
`;

const conditionalAppScss = `:host {
    --accent: #6366f1;
    display: block;
    max-width: 440px;
    font-family: system-ui, sans-serif;
    color: #1e293b;
}

.note {
    margin: 0 0 20px;
    padding: 12px 14px;
    font-size: 13px;
    line-height: 1.6;
    color: #475569;
    background: #f1f5f9;
    border-left: 3px solid var(--accent);
    border-radius: 8px;
}

code {
    font-family: ui-monospace, monospace;
    font-size: 12px;
    background: #e2e8f0;
    padding: 1px 5px;
    border-radius: 4px;
}

.panel {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 18px;
}

.card {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 16px;
    border-radius: 12px;
}

.card strong {
    font-size: 16px;
}

.card span {
    font-size: 13px;
    opacity: 0.9;
}

.card.welcome {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
}

.card.guest {
    background: #f1f5f9;
    color: #475569;
    border: 1px solid #e2e8f0;
}

.tip {
    padding: 10px 12px;
    font-size: 13px;
    color: #92400e;
    background: #fffbeb;
    border: 1px solid #fde68a;
    border-radius: 8px;
}

.buttons {
    display: flex;
    gap: 10px;
}

button {
    font: inherit;
    padding: 9px 16px;
    border: none;
    border-radius: 8px;
    background: var(--accent);
    color: white;
    cursor: pointer;

    &:hover {
        background: #4f46e5;
    }
}

button.ghost {
    background: #e2e8f0;
    color: #475569;

    &:hover {
        background: #cbd5e1;
    }
}
`;

const lifecycleMain = `import './LifecycleApp';

document.body.insertAdjacentHTML('beforeend', '<lifecycle-app></lifecycle-app>');
`;

const lifecycleStoreTs = `import { signal } from '@neuralfog/elemix/signal';

export type LogEntry = { id: number; event: string };

export const log = signal<{ entries: LogEntry[] }>({ entries: [] });

let seq = 0;

export const record = (event: string): void => {
    seq++;
    log.value.entries.push({ id: seq, event });
};

export const clearLog = (): void => {
    seq = 0;
    log.value.entries.length = 0;
};
`;

const lifecycleChildTs = `import { Component, defineComponent, html, type Template } from '@neuralfog/elemix';

import css from './LifecycleChild.scss?inline';

import { record } from './store';

type ChildProps = { tick: number };

export class LifecycleChild extends Component<ChildProps> {
    static styles = [css];

    beforeMount(): void {
        record('beforeMount');
    }

    onMount(): void {
        record('onMount');
    }

    onMutation(): void {
        record('onMutation');
    }

    onDispose(): void {
        record('onDispose');
    }

    template = (): Template => html\`<div class="child">Child · tick \${this.props.tick}</div>\`;
}

defineComponent('lifecycle-child', LifecycleChild);
`;

const logViewTs = `import { Component, defineComponent, html, type Template } from '@neuralfog/elemix';
import { repeat } from '@neuralfog/elemix/directives';

import css from './LogView.scss?inline';

import { log } from './store';

export class LogView extends Component {
    static styles = [css];

    template = (): Template => html\`<div class="log">
        \${
            log.value.entries.length
                ? repeat(
                      log.value.entries,
                      (e) => html\`<div .class=\${{ entry: true, [e.event]: true }}>
                          <span class="n">\${e.id}</span>\${e.event}()
                      </div>\`,
                      (e) => String(e.id),
                  )
                : html\`<div class="empty">No events yet — mount the child.</div>\`
        }
    </div>\`;
}

defineComponent('log-view', LogView);
`;

const lifecycleAppTs = `import { Component, defineComponent, html, type Template } from '@neuralfog/elemix';
import { state } from '@neuralfog/elemix/state';

import css from './LifecycleApp.scss?inline';

import './LifecycleChild';
import './LogView';
import { clearLog } from './store';

type State = {
    mounted: boolean;
    tick: number;
};

export class LifecycleApp extends Component {
    static styles = [css];

    state = state<State>({
        mounted: false,
        tick: 0,
    });

    toggleMount = (): void => {
        this.state.mounted = !this.state.mounted;
    };

    update = (): void => {
        this.state.tick++;
    };

    clear = (): void => {
        clearLog();
    };

    template = (): Template => html\`
        <p class="note">
            Mounting and unmounting the child fires <code>beforeMount</code>,
            <code>onMount</code> and <code>onDispose</code>. Updating it
            re-renders and fires <code>onMutation</code>. Each hook appends to
            the log below.
        </p>
        <div class="stage">
            \${
                this.state.mounted
                    ? html\`<lifecycle-child :tick=\${this.state.tick} />\`
                    : html\`<div class="empty">child unmounted</div>\`
            }
        </div>
        <div class="buttons">
            <button @click=\${this.toggleMount}>
                \${this.state.mounted ? 'Unmount' : 'Mount'}
            </button>
            <button @click=\${this.update} .disabled=\${!this.state.mounted}>
                Update child
            </button>
            <button class="ghost" @click=\${this.clear}>Clear log</button>
        </div>
        <log-view />
    \`;
}

defineComponent('lifecycle-app', LifecycleApp);
`;

const lifecycleAppScss = `:host {
    --accent: #6366f1;
    display: block;
    max-width: 460px;
    font-family: system-ui, sans-serif;
    color: #1e293b;
}

.note {
    margin: 0 0 20px;
    padding: 12px 14px;
    font-size: 13px;
    line-height: 1.6;
    color: #475569;
    background: #f1f5f9;
    border-left: 3px solid var(--accent);
    border-radius: 8px;
}

code {
    font-family: ui-monospace, monospace;
    font-size: 12px;
    background: #e2e8f0;
    padding: 1px 5px;
    border-radius: 4px;
}

.stage {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 56px;
    margin-bottom: 14px;
    padding: 12px;
    border: 1px dashed #cbd5e1;
    border-radius: 12px;
}

.stage .empty {
    font-size: 13px;
    color: #94a3b8;
}

.buttons {
    display: flex;
    gap: 10px;
    margin-bottom: 16px;
}

button {
    font: inherit;
    padding: 9px 14px;
    border: none;
    border-radius: 8px;
    background: var(--accent);
    color: white;
    cursor: pointer;

    &:hover:not(:disabled) {
        background: #4f46e5;
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
}

button.ghost {
    background: #e2e8f0;
    color: #475569;

    &:hover {
        background: #cbd5e1;
    }
}
`;

const lifecycleChildScss = `:host {
    display: block;
    font-family: system-ui, sans-serif;
}

.child {
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 600;
    color: white;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border-radius: 10px;
}
`;

const logViewScss = `:host {
    display: block;
}

.log {
    display: flex;
    flex-direction: column;
    gap: 3px;
    max-height: 180px;
    overflow-y: auto;
    padding: 8px;
    background: #0f172a;
    border-radius: 10px;
}

.empty {
    padding: 10px;
    font-family: system-ui, sans-serif;
    font-size: 13px;
    color: #64748b;
}

.entry {
    display: flex;
    gap: 8px;
    align-items: baseline;
    padding: 3px 8px;
    font-family: ui-monospace, monospace;
    font-size: 13px;
    color: #cbd5e1;
}

.entry .n {
    min-width: 18px;
    color: #64748b;
}

.entry.beforeMount {
    color: #7dd3fc;
}

.entry.onMount {
    color: #86efac;
}

.entry.onMutation {
    color: #fbbf24;
}

.entry.onDispose {
    color: #f87171;
}
`;

const refMain = `import './RefApp';

document.body.insertAdjacentHTML('beforeend', '<ref-app></ref-app>');
`;

const refAppTs = `import { Component, defineComponent, html, type Template } from '@neuralfog/elemix';
import { state } from '@neuralfog/elemix/state';
import { ref } from '@neuralfog/elemix/utilities';

import css from './RefApp.scss?inline';

type State = {
    width: number;
};

export class RefApp extends Component {
    static styles = [css];

    input = ref<HTMLInputElement>();

    state = state<State>({ width: 0 });

    focusInput = (): void => {
        this.input.value?.focus();
    };

    measure = (): void => {
        this.state.width = this.input.value?.offsetWidth ?? 0;
    };

    template = (): Template => html\`
        <p class="note">
            <code>:ref</code> binds a DOM node to a <code>ref()</code>. Read the
            element imperatively through <code>this.input.value</code> — here to
            focus the field and measure its width.
        </p>
        <input type="text" :ref=\${this.input} placeholder="Type something…" />
        <div class="buttons">
            <button @click=\${this.focusInput}>Focus</button>
            <button class="ghost" @click=\${this.measure}>Measure width</button>
        </div>
        \${
            this.state.width
                ? html\`<div class="out">Input is \${this.state.width}px wide</div>\`
                : ''
        }
    \`;
}

defineComponent('ref-app', RefApp);
`;

const refAppScss = `:host {
    --accent: #6366f1;
    display: block;
    max-width: 440px;
    font-family: system-ui, sans-serif;
    color: #1e293b;
}

.note {
    margin: 0 0 20px;
    padding: 12px 14px;
    font-size: 13px;
    line-height: 1.6;
    color: #475569;
    background: #f1f5f9;
    border-left: 3px solid var(--accent);
    border-radius: 8px;
}

code {
    font-family: ui-monospace, monospace;
    font-size: 12px;
    background: #e2e8f0;
    padding: 1px 5px;
    border-radius: 4px;
}

input {
    box-sizing: border-box;
    width: 100%;
    margin-bottom: 12px;
    font: inherit;
    font-size: 15px;
    padding: 9px 12px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    outline: none;

    &:focus {
        border-color: var(--accent);
    }
}

.buttons {
    display: flex;
    gap: 10px;
    margin-bottom: 14px;
}

button {
    font: inherit;
    padding: 9px 16px;
    border: none;
    border-radius: 8px;
    background: var(--accent);
    color: white;
    cursor: pointer;

    &:hover {
        background: #4f46e5;
    }
}

button.ghost {
    background: #e2e8f0;
    color: #475569;

    &:hover {
        background: #cbd5e1;
    }
}

.out {
    font-size: 14px;
    font-weight: 600;
    color: var(--accent);
}
`;

const slotMain = `import './SlotApp';

document.body.insertAdjacentHTML('beforeend', '<slot-app></slot-app>');
`;

const appCardTs = `import { Component, defineComponent, html, type Template } from '@neuralfog/elemix';

import css from './AppCard.scss?inline';

export class AppCard extends Component {
    static styles = [css];

    template = (): Template => html\`<div class="card">
        \${
            this.hasSlot('header')
                ? html\`<div class="header"><slot name="header"></slot></div>\`
                : ''
        }
        <div class="body"><slot></slot></div>
        \${
            this.hasSlot('footer')
                ? html\`<div class="footer"><slot name="footer"></slot></div>\`
                : ''
        }
    </div>\`;
}

defineComponent('app-card', AppCard);
`;

const slotAppTs = `import { Component, defineComponent, html, type Template } from '@neuralfog/elemix';

import css from './SlotApp.scss?inline';

import './AppCard';

export class SlotApp extends Component {
    static styles = [css];

    template = (): Template => html\`
        <p class="note">
            Slots project light-DOM children into a component's shadow DOM.
            <code>hasSlot('footer')</code> lets the card render an area only when
            matching content is provided.
        </p>
        <app-card>
            <span slot="header">⭐ Featured</span>
            <p>Default-slot content lives in the card body.</p>
            <span slot="footer">Updated just now</span>
        </app-card>
        <app-card>
            <p>This card has only body content — no header or footer slot.</p>
        </app-card>
    \`;
}

defineComponent('slot-app', SlotApp);
`;

const slotAppScss = `:host {
    --accent: #6366f1;
    display: block;
    max-width: 440px;
    font-family: system-ui, sans-serif;
    color: #1e293b;
}

.note {
    margin: 0 0 20px;
    padding: 12px 14px;
    font-size: 13px;
    line-height: 1.6;
    color: #475569;
    background: #f1f5f9;
    border-left: 3px solid var(--accent);
    border-radius: 8px;
}

code {
    font-family: ui-monospace, monospace;
    font-size: 12px;
    background: #e2e8f0;
    padding: 1px 5px;
    border-radius: 4px;
}
`;

const appCardScss = `:host {
    display: block;
    margin-bottom: 14px;
    font-family: system-ui, sans-serif;
}

.card {
    overflow: hidden;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
}

.header {
    padding: 10px 16px;
    font-weight: 700;
    color: white;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
}

.body {
    padding: 16px;
    color: #1e293b;
}

.body p {
    margin: 0;
}

.footer {
    padding: 8px 16px;
    font-size: 12px;
    color: #64748b;
    background: #f8fafc;
    border-top: 1px solid #e2e8f0;
}
`;

const nestedMain = `import './NestedApp';

document.body.insertAdjacentHTML('beforeend', '<nested-app></nested-app>');
`;

const nestedAppTs = `import { Component, defineComponent, html, type Template } from '@neuralfog/elemix';
import { state } from '@neuralfog/elemix/state';
import { repeat } from '@neuralfog/elemix/directives';

import css from './NestedApp.scss?inline';

type Item = { id: string; name: string };
type Category = { id: string; name: string; items: Item[] };

type State = {
    categories: Category[];
};

export class NestedApp extends Component {
    static styles = [css];

    state = state<State>({
        categories: [
            {
                id: 'fruit',
                name: 'Fruit',
                items: [
                    { id: 'apple', name: 'Apple' },
                    { id: 'banana', name: 'Banana' },
                ],
            },
            {
                id: 'veg',
                name: 'Vegetables',
                items: [{ id: 'carrot', name: 'Carrot' }],
            },
        ],
    });

    addItem = (category: Category): void => {
        category.items.push({ id: crypto.randomUUID(), name: 'New item' });
    };

    template = (): Template => html\`
        <p class="note">
            <code>repeat</code> nests: the outer loop renders categories, each
            with its own inner <code>repeat</code> of items. Both levels are
            keyed, so adding an item patches only that one list.
        </p>
        <div class="tree">
            \${repeat(
                this.state.categories,
                (category) => html\`<div class="category">
                    <div class="head">
                        <strong>\${category.name}</strong>
                        <button @click=\${() => this.addItem(category)}>+ item</button>
                    </div>
                    <ul>
                        \${repeat(
                            category.items,
                            (item) => html\`<li>\${item.name}</li>\`,
                            (item) => item.id,
                        )}
                    </ul>
                </div>\`,
                (category) => category.id,
            )}
        </div>
    \`;
}

defineComponent('nested-app', NestedApp);
`;

const nestedAppScss = `:host {
    --accent: #6366f1;
    display: block;
    max-width: 440px;
    font-family: system-ui, sans-serif;
    color: #1e293b;
}

.note {
    margin: 0 0 20px;
    padding: 12px 14px;
    font-size: 13px;
    line-height: 1.6;
    color: #475569;
    background: #f1f5f9;
    border-left: 3px solid var(--accent);
    border-radius: 8px;
}

code {
    font-family: ui-monospace, monospace;
    font-size: 12px;
    background: #e2e8f0;
    padding: 1px 5px;
    border-radius: 4px;
}

.tree {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.category {
    overflow: hidden;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
}

.head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    background: #f1f5f9;
}

.head strong {
    font-size: 15px;
}

.head button {
    font: inherit;
    font-size: 13px;
    padding: 5px 10px;
    border: none;
    border-radius: 6px;
    background: var(--accent);
    color: white;
    cursor: pointer;

    &:hover {
        background: #4f46e5;
    }
}

ul {
    display: flex;
    flex-direction: column;
    gap: 4px;
    list-style: none;
    margin: 0;
    padding: 8px 14px;
}

li {
    padding: 4px 0;
    font-size: 14px;
}
`;

const formMain = `import './FormApp';

document.body.insertAdjacentHTML('beforeend', '<form-app></form-app>');
`;

const ratingInputTs = `import { Component, defineComponent, html, type Template } from '@neuralfog/elemix';
import { state } from '@neuralfog/elemix/state';
import { repeat } from '@neuralfog/elemix/directives';

import css from './RatingInput.scss?inline';

type State = {
    value: number;
};

export class RatingInput extends Component {
    static styles = [css];

    static formAssociated = true;
    declare internals: ElementInternals;

    state = state<State>({ value: 0 });

    beforeMount(): void {
        this.internals.setFormValue(String(this.state.value));
    }

    set = (n: number): void => {
        this.state.value = n;
        this.internals.setFormValue(String(n));
    };

    template = (): Template => html\`<div class="stars">
        \${repeat(
            [1, 2, 3, 4, 5],
            (n) => html\`<button
                type="button"
                .class=\${{ star: true, on: n <= this.state.value }}
                @click=\${() => this.set(n)}
            >★</button>\`,
            (n) => String(n),
        )}
    </div>\`;
}

defineComponent('rating-input', RatingInput);
`;

const submitButtonTs = `import { Component, defineComponent, html, type Template } from '@neuralfog/elemix';

import css from './SubmitButton.scss?inline';

export class SubmitButton extends Component {
    static styles = [css];

    static formAssociated = true;
    declare internals: ElementInternals;

    submit = (): void => {
        this.internals.form?.requestSubmit();
    };

    template = (): Template =>
        html\`<button type="button" @click=\${this.submit}><slot></slot></button>\`;
}

defineComponent('submit-button', SubmitButton);
`;

const formAppTs = `import { Component, defineComponent, html, type Template } from '@neuralfog/elemix';
import { state } from '@neuralfog/elemix/state';

import css from './FormApp.scss?inline';

import './RatingInput';
import './SubmitButton';

type State = {
    result: string;
};

export class FormApp extends Component {
    static styles = [css];

    state = state<State>({ result: '' });

    submit = (e: Event): void => {
        e.preventDefault();
        const data = new FormData(e.target as HTMLFormElement);
        this.state.result = JSON.stringify(Object.fromEntries(data), null, 2);
    };

    template = (): Template => html\`
        <p class="note">
            With <code>static formAssociated = true</code>, Elemix attaches
            <code>ElementInternals</code>. Both the star rating and the submit
            button are custom elements that take part in the native form.
        </p>
        <form @submit=\${this.submit}>
            <label>
                Name
                <input name="name" type="text" value="Ada" />
            </label>
            <label>
                Rating
                <rating-input name="rating" />
            </label>
            <submit-button>Submit</submit-button>
        </form>
        \${
            this.state.result
                ? html\`<pre class="out">\${this.state.result}</pre>\`
                : ''
        }
    \`;
}

defineComponent('form-app', FormApp);
`;

const ratingInputScss = `:host {
    display: inline-block;
}

.stars {
    display: flex;
    gap: 2px;
}

button.star {
    padding: 0;
    font-size: 24px;
    line-height: 1;
    color: #cbd5e1;
    background: none;
    border: none;
    cursor: pointer;
    transition: color 0.1s ease;
}

button.star.on {
    color: #f59e0b;
}

button.star:hover {
    color: #fbbf24;
}
`;

const formAppScss = `:host {
    --accent: #6366f1;
    display: block;
    max-width: 440px;
    font-family: system-ui, sans-serif;
    color: #1e293b;
}

.note {
    margin: 0 0 20px;
    padding: 12px 14px;
    font-size: 13px;
    line-height: 1.6;
    color: #475569;
    background: #f1f5f9;
    border-left: 3px solid var(--accent);
    border-radius: 8px;
}

code {
    font-family: ui-monospace, monospace;
    font-size: 12px;
    background: #e2e8f0;
    padding: 1px 5px;
    border-radius: 4px;
}

form {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-bottom: 16px;
}

label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 13px;
    color: #475569;
}

input[type='text'] {
    font: inherit;
    font-size: 15px;
    padding: 9px 12px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    outline: none;

    &:focus {
        border-color: var(--accent);
    }
}

submit-button {
    align-self: flex-start;
}

.out {
    margin: 0;
    padding: 12px 14px;
    font-family: ui-monospace, monospace;
    font-size: 13px;
    color: #86efac;
    background: #0f172a;
    border-radius: 10px;
    overflow-x: auto;
}
`;

const submitButtonScss = `:host {
    display: inline-block;
}

button {
    font: inherit;
    padding: 9px 18px;
    border: none;
    border-radius: 8px;
    background: #6366f1;
    color: white;
    cursor: pointer;

    &:hover {
        background: #4f46e5;
    }
}
`;

const statusMain = `import './StatusApp';

document.body.insertAdjacentHTML('beforeend', '<status-app></status-app>');
`;

const statusAppTs = `import { Component, defineComponent, html, type Template } from '@neuralfog/elemix';
import { state } from '@neuralfog/elemix/state';
import { when, choose } from '@neuralfog/elemix/directives';

import css from './StatusApp.scss?inline';

type Status = 'idle' | 'loading' | 'ready' | 'failed';

type State = {
    status: Status;
    showLog: boolean;
};

export class StatusApp extends Component {
    static styles = [css];

    state = state<State>({
        status: 'idle',
        showLog: false,
    });

    set = (status: Status): void => {
        this.state.status = status;
    };

    toggleLog = (): void => {
        this.state.showLog = !this.state.showLog;
    };

    template = (): Template => html\`
        <p class="note">
            <code>choose</code> renders the first branch whose condition is
            truthy — use <code>[true, ...]</code> as the fallback.
            <code>when</code> renders one branch or nothing. Both take lazy
            factory functions, so only the chosen branch is ever built.
        </p>

        <div class="bar">
            <button @click=\${() => this.set('idle')}>Idle</button>
            <button @click=\${() => this.set('loading')}>Loading</button>
            <button @click=\${() => this.set('ready')}>Ready</button>
            <button @click=\${() => this.set('failed')}>Failed</button>
        </div>

        <div class="stage">
            \${choose([
                [
                    this.state.status === 'loading',
                    () => html\`<div class="card loading">
                        <span class="spinner"></span>Working…
                    </div>\`,
                ],
                [
                    this.state.status === 'ready',
                    () => html\`<div class="card ready">✓ Deployed</div>\`,
                ],
                [
                    this.state.status === 'failed',
                    () => html\`<div class="card failed">✕ Build failed</div>\`,
                ],
                [
                    true,
                    () => html\`<div class="card idle">Pick a status above</div>\`,
                ],
            ])}
        </div>

        <button class="link" @click=\${this.toggleLog}>
            \${this.state.showLog ? 'Hide' : 'Show'} log
        </button>

        \${when(
            this.state.showLog,
            () => html\`<pre class="log">status = \${this.state.status}</pre>\`,
        )}
    \`;
}

defineComponent('status-app', StatusApp);
`;

const statusAppScss = `:host {
    --accent: #6366f1;
    display: block;
    max-width: 460px;
    font-family: system-ui, sans-serif;
    color: #1e293b;
}

.note {
    margin: 0 0 18px;
    padding: 12px 14px;
    font-size: 13px;
    line-height: 1.6;
    color: #475569;
    background: #f1f5f9;
    border-left: 3px solid var(--accent);
    border-radius: 8px;
}

code {
    font-family: ui-monospace, monospace;
    font-size: 12px;
    background: #e2e8f0;
    padding: 1px 5px;
    border-radius: 4px;
}

.bar {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
}

button {
    font: inherit;
    font-size: 13px;
    padding: 7px 12px;
    color: #1e293b;
    background: #e2e8f0;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.15s ease;
}

button:hover {
    background: #cbd5e1;
}

.stage {
    margin-bottom: 14px;
}

.card {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 18px 20px;
    font-size: 14px;
    font-weight: 600;
    border-radius: 12px;
}

.card.idle {
    color: #64748b;
    background: #f1f5f9;
    border: 1px dashed #cbd5e1;
}

.card.loading {
    color: #3730a3;
    background: #e0e7ff;
}

.card.ready {
    color: #166534;
    background: #dcfce7;
}

.card.failed {
    color: #991b1b;
    background: #fee2e2;
}

.spinner {
    width: 14px;
    height: 14px;
    border: 2px solid #c7d2fe;
    border-top-color: #4338ca;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.link {
    background: none;
    padding: 4px 0;
    color: var(--accent);
    font-size: 13px;
}

.link:hover {
    background: none;
    text-decoration: underline;
}

.log {
    margin: 10px 0 0;
    padding: 12px 14px;
    font-family: ui-monospace, monospace;
    font-size: 12px;
    color: #e2e8f0;
    background: #0f172a;
    border-radius: 8px;
}
`;

export const APPS: App[] = [
    {
        id: 'counter',
        name: 'Counter',
        files: {
            'main.ts': counterMain,
            'CounterApp.ts': counterTs,
            'CounterApp.scss': counterScss,
        },
    },
    {
        id: 'todo',
        name: 'Todo App',
        files: {
            'main.ts': todoMain,
            'TodoApp.ts': todoTs,
            'TodoApp.scss': todoScss,
        },
    },
    {
        id: 'two-way-binding',
        name: 'Two-Way Binding',
        files: {
            'main.ts': modelMain,
            'ModelApp.ts': modelAppTs,
            'ModelApp.scss': modelAppScss,
        },
    },
    {
        id: 'props',
        name: 'Props',
        files: {
            'main.ts': profileMain,
            'ProfileApp.ts': profileAppTs,
            'ProfileApp.scss': profileAppScss,
            'ProfileCard.ts': profileCardTs,
            'ProfileCard.scss': profileCardScss,
        },
    },
    {
        id: 'state-in-props',
        name: 'State in Props',
        files: {
            'main.ts': storeMain,
            'StoreApp.ts': storeAppTs,
            'StoreApp.scss': storeAppScss,
            'StoreControls.ts': storeControlsTs,
            'StoreControls.scss': storeControlsScss,
        },
    },
    {
        id: 'signals',
        name: 'Signals',
        files: {
            'main.ts': signalMain,
            'store.ts': signalStoreTs,
            'SignalApp.ts': signalAppTs,
            'SignalApp.scss': signalAppScss,
            'SignalValue.ts': signalValueTs,
            'SignalValue.scss': signalValueScss,
            'SignalButtons.ts': signalButtonsTs,
            'SignalButtons.scss': signalButtonsScss,
        },
    },
    {
        id: 'on-mutation',
        name: 'onMutation',
        files: {
            'main.ts': chatMain,
            'ChatApp.ts': chatAppTs,
            'ChatApp.scss': chatAppScss,
        },
    },
    {
        id: 'render',
        name: 'render()',
        files: {
            'main.ts': renderMain,
            'RenderApp.ts': renderAppTs,
            'RenderApp.scss': renderAppScss,
        },
    },
    {
        id: 'direct-bindings',
        name: 'Direct Bindings',
        files: {
            'main.ts': directMain,
            'DirectApp.ts': directAppTs,
            'DirectApp.scss': directAppScss,
        },
    },
    {
        id: 'conditionals',
        name: 'Conditionals',
        files: {
            'main.ts': conditionalMain,
            'ConditionalApp.ts': conditionalAppTs,
            'ConditionalApp.scss': conditionalAppScss,
        },
    },
    {
        id: 'when-choose',
        name: 'When / Choose',
        files: {
            'main.ts': statusMain,
            'StatusApp.ts': statusAppTs,
            'StatusApp.scss': statusAppScss,
        },
    },
    {
        id: 'lifecycle',
        name: 'Lifecycle',
        files: {
            'main.ts': lifecycleMain,
            'LifecycleApp.ts': lifecycleAppTs,
            'LifecycleApp.scss': lifecycleAppScss,
            'LifecycleChild.ts': lifecycleChildTs,
            'LifecycleChild.scss': lifecycleChildScss,
            'LogView.ts': logViewTs,
            'LogView.scss': logViewScss,
            'store.ts': lifecycleStoreTs,
        },
    },
    {
        id: 'refs',
        name: 'Refs',
        files: {
            'main.ts': refMain,
            'RefApp.ts': refAppTs,
            'RefApp.scss': refAppScss,
        },
    },
    {
        id: 'slots',
        name: 'Slots',
        files: {
            'main.ts': slotMain,
            'SlotApp.ts': slotAppTs,
            'SlotApp.scss': slotAppScss,
            'AppCard.ts': appCardTs,
            'AppCard.scss': appCardScss,
        },
    },
    {
        id: 'nested-lists',
        name: 'Nested Lists',
        files: {
            'main.ts': nestedMain,
            'NestedApp.ts': nestedAppTs,
            'NestedApp.scss': nestedAppScss,
        },
    },
    {
        id: 'form-associated',
        name: 'Form Control',
        files: {
            'main.ts': formMain,
            'FormApp.ts': formAppTs,
            'FormApp.scss': formAppScss,
            'RatingInput.ts': ratingInputTs,
            'RatingInput.scss': ratingInputScss,
            'SubmitButton.ts': submitButtonTs,
            'SubmitButton.scss': submitButtonScss,
        },
    },
];

export const DEFAULT_APP = APPS[0];

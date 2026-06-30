import { Component, defineComponent, html, type Template } from '@neuralfog/elemix';
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

    template = (): Template => html`
        <p class="note">
            <code>choose</code> renders the first branch whose condition is
            truthy — use <code>[true, ...]</code> as the fallback.
            <code>when</code> renders one branch or nothing. Both take lazy
            factory functions, so only the chosen branch is ever built.
        </p>

        <div class="bar">
            <button @click=${() => this.set('idle')}>Idle</button>
            <button @click=${() => this.set('loading')}>Loading</button>
            <button @click=${() => this.set('ready')}>Ready</button>
            <button @click=${() => this.set('failed')}>Failed</button>
        </div>

        <div class="stage">
            ${choose([
                [
                    this.state.status === 'loading',
                    () => html`<div class="card loading">
                        <span class="spinner"></span>Working…
                    </div>`,
                ],
                [
                    this.state.status === 'ready',
                    () => html`<div class="card ready">✓ Deployed</div>`,
                ],
                [
                    this.state.status === 'failed',
                    () => html`<div class="card failed">✕ Build failed</div>`,
                ],
                [
                    true,
                    () => html`<div class="card idle">Pick a status above</div>`,
                ],
            ])}
        </div>

        <button class="link" @click=${this.toggleLog}>
            ${this.state.showLog ? 'Hide' : 'Show'} log
        </button>

        ${when(
            this.state.showLog,
            () => html`<pre class="log">status = ${this.state.status}</pre>`,
        )}
    `;
}

defineComponent('status-app', StatusApp);

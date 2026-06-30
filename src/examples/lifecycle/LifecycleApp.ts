import { Component, defineComponent, html, type Template } from '@neuralfog/elemix';
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

    template = (): Template => html`
        <p class="note">
            Mounting and unmounting the child fires <code>beforeMount</code>,
            <code>onMount</code> and <code>onDispose</code>. Updating it
            re-renders and fires <code>onMutation</code>. Each hook appends to
            the log below.
        </p>
        <div class="stage">
            ${
                this.state.mounted
                    ? html`<lifecycle-child :tick=${this.state.tick} />`
                    : html`<div class="empty">child unmounted</div>`
            }
        </div>
        <div class="buttons">
            <button @click=${this.toggleMount}>
                ${this.state.mounted ? 'Unmount' : 'Mount'}
            </button>
            <button @click=${this.update} .disabled=${!this.state.mounted}>
                Update child
            </button>
            <button class="ghost" @click=${this.clear}>Clear log</button>
        </div>
        <log-view />
    `;
}

defineComponent('lifecycle-app', LifecycleApp);

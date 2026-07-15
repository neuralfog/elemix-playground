import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';

import css from './LifecycleApp.scss?inline';
import './LifecycleChild';
import './LogView';
import { clearLog } from './store';

type State = {
    mounted: boolean;
    tick: number;
};

// #component
export class LifecycleApp extends Component {
    // #styles
    styles = css;

    // #state
    state: State = {
        mounted: false,
        tick: 0,
    };

    toggleMount = (): void => {
        this.state.mounted = !this.state.mounted;
    };

    update = (): void => {
        this.state.tick++;
    };

    clear = (): void => {
        clearLog();
    };

    template = (): Template => tpl`
        <div class="stage">
            ${
                this.state.mounted
                    ? tpl`<lifecycle-child :tick=${this.state.tick} />`
                    : tpl`<div class="empty">child unmounted</div>`
            }
        </div>
        <div class="buttons">
            <button @click=${this.toggleMount}>
                ${this.state.mounted ? 'Unmount' : 'Mount'}
            </button>
            <button @click=${this.update} disabled=${!this.state.mounted}>
                Update child
            </button>
            <button class="ghost" @click=${this.clear}>Clear log</button>
        </div>
        <log-view />
    `;
}

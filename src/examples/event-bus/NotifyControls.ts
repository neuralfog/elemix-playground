import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';

import css from './NotifyControls.scss?inline';
import { bus, type Notification } from './bus';

let nextId = 0;

// #component
export class NotifyControls extends Component {
    // #styles
    styles = css;

    send = (kind: Notification['kind'], text: string): void => {
        bus.emit('notify', { id: ++nextId, text, kind });
    };

    template = (): Template => tpl`
        <div class="controls">
            <button class="info" @click=${() => this.send('info', 'Heads up')}>
                Info
            </button>
            <button class="success" @click=${() => this.send('success', 'Saved!')}>
                Success
            </button>
            <button class="warn" @click=${() => this.send('warn', 'Careful')}>
                Warn
            </button>
        </div>
    `;
}

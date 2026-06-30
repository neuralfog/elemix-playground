import { Component, tpl } from '@neuralfog/elemix';
import { repeat } from '@neuralfog/elemix/directives';
import type { Template } from '@neuralfog/elemix/types';

import css from './NotifyFeed.scss?inline';
import { bus, type Notification } from './bus';

type State = { items: Notification[] };

// #component
export class NotifyFeed extends Component {
    // #styles
    styles = css;

    // #state
    state: State = { items: [] };

    off = (): void => {};

    // #mount
    subscribe(): void {
        this.off = bus.on('notify', (n) => {
            this.state.items = [n, ...this.state.items].slice(0, 5);
        });
    }

    // #dispose
    unsubscribe(): void {
        this.off();
    }

    template = (): Template => tpl`
        <div class="feed">
            ${
                this.state.items.length
                    ? repeat(
                          this.state.items,
                          (n) => tpl`<div class="toast ${n.kind}">${n.text}</div>`,
                          (n) => n.id,
                      )
                    : tpl`<div class="empty">No notifications yet</div>`
            }
        </div>
    `;
}

import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';

import css from './BusApp.scss?inline';
import './NotifyControls';
import './NotifyFeed';

// #component
export class BusApp extends Component {
    // #styles
    styles = css;

    template = (): Template => tpl`
        <p class="note">
            A singleton <code>bus</code> (see <code>bus.ts</code>) is plain
            pub/sub. <code>&lt;notify-controls&gt;</code> calls
            <code>bus.emit</code> and <code>&lt;notify-feed&gt;</code> subscribes
            with <code>bus.on</code> in <code>#mount</code> - they talk with no
            shared parent state and no events between them.
        </p>
        <notify-controls />
        <notify-feed />
    `;
}

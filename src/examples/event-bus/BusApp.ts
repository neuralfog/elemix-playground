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
        <notify-controls />
        <notify-feed />
    `;
}

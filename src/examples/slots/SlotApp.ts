import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';

import css from './SlotApp.scss?inline';
import './AppCard';

// #component
export class SlotApp extends Component {
    // #styles
    styles = css;

    template = (): Template => tpl`
        <app-card>
            <span slot="header">⭐ Featured</span>
            <p>Default-slot content lives in the card body.</p>
            <span slot="footer">Updated just now</span>
        </app-card>
        <app-card>
            <p>This card has only body content - no header or footer slot.</p>
        </app-card>
    `;
}

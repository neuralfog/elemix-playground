import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';

import css from './SlotApp.scss?inline';
import './AppCard';

// #component
export class SlotApp extends Component {
    // #styles
    styles = css;

    template = (): Template => tpl`
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
            <p>This card has only body content - no header or footer slot.</p>
        </app-card>
    `;
}

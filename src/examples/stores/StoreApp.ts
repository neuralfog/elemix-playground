import { Component, defineComponent, html, type Template } from '@neuralfog/elemix';

import css from './StoreApp.scss?inline';

import './StoreValue';
import './StoreButtons';

export class StoreApp extends Component {
    static styles = [css];

    template = (): Template => html`
        <p class="note">
            A <code>store</code> is global state created in its own module
            (<code>store.ts</code>) and imported wherever it is needed. The two
            components below are siblings with no props between them — yet the
            buttons in one update the number shown in the other, because both
            read the same store.
        </p>
        <store-value />
        <store-buttons />
    `;
}

defineComponent('store-app', StoreApp);

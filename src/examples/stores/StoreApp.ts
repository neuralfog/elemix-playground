import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';

import css from './StoreApp.scss?inline';
import './StoreValue';
import './StoreButtons';

// #component
export class StoreApp extends Component {
    // #styles
    styles = css;

    template = (): Template => tpl`
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

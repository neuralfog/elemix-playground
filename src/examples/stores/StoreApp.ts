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
        <store-value />
        <store-buttons />
    `;
}

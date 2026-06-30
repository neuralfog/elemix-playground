import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';

import css from './StoreValue.scss?inline';
import { counter } from './store';

// #component
export class StoreValue extends Component {
    // #styles
    styles = css;

    template = (): Template => tpl`<div class="value">${counter.count}</div>`;
}

import { Component, defineComponent, html, type Template } from '@neuralfog/elemix';

import css from './StoreValue.scss?inline';

import { counter } from './store';

export class StoreValue extends Component {
    static styles = [css];

    template = (): Template => html`<div class="value">${counter.value.count}</div>`;
}

defineComponent('store-value', StoreValue);

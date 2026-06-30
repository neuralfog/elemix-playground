import { Component, defineComponent, html, type Template } from '@neuralfog/elemix';

import css from './StoreButtons.scss?inline';

import { counter } from './store';

export class StoreButtons extends Component {
    static styles = [css];

    dec = (): void => {
        counter.value.count--;
    };

    reset = (): void => {
        counter.value.count = 0;
    };

    inc = (): void => {
        counter.value.count++;
    };

    template = (): Template => html`<div class="buttons">
        <button @click=${this.dec}>−</button>
        <button @click=${this.reset}>Reset</button>
        <button @click=${this.inc}>+</button>
    </div>`;
}

defineComponent('store-buttons', StoreButtons);

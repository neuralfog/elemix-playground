import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';

import css from './StoreButtons.scss?inline';
import { counter } from './store';

// #component
export class StoreButtons extends Component {
    // #styles
    styles = css;

    dec = (): void => {
        counter.count--;
    };

    reset = (): void => {
        counter.count = 0;
    };

    inc = (): void => {
        counter.count++;
    };

    template = (): Template => tpl`<div class="buttons">
        <button @click=${this.dec}>−</button>
        <button @click=${this.reset}>Reset</button>
        <button @click=${this.inc}>+</button>
    </div>`;
}

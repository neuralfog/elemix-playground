import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';

import css from './StoreControls.scss?inline';

type Props = {
    counter: { value: number };
};

// #component
export class StoreControls extends Component<Props> {
    // #styles
    styles = css;

    dec = (): void => {
        this.props.counter.value--;
    };

    inc = (): void => {
        this.props.counter.value++;
    };

    template = (): Template => tpl`<div class="panel">
        <span class="label">Child controls</span>
        <div class="buttons">
            <button @click=${this.dec}>−</button>
            <span class="value">${this.props.counter.value}</span>
            <button @click=${this.inc}>+</button>
        </div>
    </div>`;
}

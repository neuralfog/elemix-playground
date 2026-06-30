import { Component, defineComponent, html, type Template } from '@neuralfog/elemix';

import css from './StoreControls.scss?inline';

type Props = {
    counter: { value: number };
};

export class StoreControls extends Component<Props> {
    static styles = [css];

    dec = (): void => {
        this.props.counter.value--;
    };

    inc = (): void => {
        this.props.counter.value++;
    };

    template = (): Template => html`<div class="panel">
        <span class="label">Child controls</span>
        <div class="buttons">
            <button @click=${this.dec}>−</button>
            <span class="value">${this.props.counter.value}</span>
            <button @click=${this.inc}>+</button>
        </div>
    </div>`;
}

defineComponent('store-controls', StoreControls);

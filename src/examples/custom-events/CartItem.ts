import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';

import css from './CartItem.scss?inline';

type Props = {
    id: string;
    name: string;
    price: number;
    qty: number;
};

// #component
export class CartItem extends Component<Props> {
    // #styles
    styles = css;

    emitQty = (qty: number): void => {
        this.dispatchEvent(
            new CustomEvent('qtychange', {
                detail: { id: this.props.id, qty: Math.max(0, qty) },
                bubbles: true,
            }),
        );
    };

    drop = (): void => {
        this.dispatchEvent(
            new CustomEvent('itemremove', {
                detail: { id: this.props.id },
                bubbles: true,
            }),
        );
    };

    template = (): Template => tpl`<div class="item">
        <span class="name">${this.props.name}</span>
        <span class="price">$${this.props.price}</span>
        <div class="stepper">
            <button @click=${() => this.emitQty(this.props.qty - 1)}>−</button>
            <span class="qty">${this.props.qty}</span>
            <button @click=${() => this.emitQty(this.props.qty + 1)}>+</button>
        </div>
        <button class="remove" @click=${this.drop}>✕</button>
    </div>`;
}

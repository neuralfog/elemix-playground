import { Component, tpl } from '@neuralfog/elemix';
import { repeat } from '@neuralfog/elemix/directives';
import type { Template } from '@neuralfog/elemix/types';

import css from './CartApp.scss?inline';
import './CartItem';

type Line = { id: string; name: string; price: number; qty: number };

type State = { lines: Line[] };

// #component
export class CartApp extends Component {
    // #styles
    styles = css;

    // #state
    state: State = {
        lines: [
            { id: 'a', name: 'Coffee beans', price: 12, qty: 1 },
            { id: 'b', name: 'Oat milk', price: 4, qty: 2 },
            { id: 'c', name: 'Filter papers', price: 6, qty: 1 },
        ],
    };

    onQtyChange = (e: Event): void => {
        const { id, qty } = (
            e as CustomEvent<{ id: string; qty: number }>
        ).detail;
        const line = this.state.lines.find((l) => l.id === id);
        if (line) line.qty = qty;
    };

    onRemove = (e: Event): void => {
        const { id } = (e as CustomEvent<{ id: string }>).detail;
        this.state.lines = this.state.lines.filter((l) => l.id !== id);
    };

    get total(): number {
        return this.state.lines.reduce((sum, l) => sum + l.price * l.qty, 0);
    }

    template = (): Template => tpl`
        <div
            class="cart"
            @qtychange=${this.onQtyChange}
            @itemremove=${this.onRemove}
        >
            ${repeat(
                this.state.lines,
                (line) => tpl`<cart-item
                    :id=${line.id}
                    :name=${line.name}
                    :price=${line.price}
                    :qty=${line.qty}
                />`,
                (line) => line.id,
            )}
        </div>
        <div class="total">Total <strong>$${this.total}</strong></div>
    `;
}

import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';

import css from './CounterApp.scss?inline';

// #component
export class CounterApp extends Component {
    // #styles
    styles = css;

    // #state
    count = 0;

    increment = (): void => {
        this.count++;
    };

    template = (): Template => tpl`
        <button @click=${this.increment}>count is ${this.count}</button>
    `;
}

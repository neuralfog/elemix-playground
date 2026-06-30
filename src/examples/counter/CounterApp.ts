import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';

import css from './CounterApp.scss?inline';

type State = {
    count: number;
};

// #component
export class CounterApp extends Component {
    // #styles
    styles = css;

    // #state
    state: State = { count: 0 };

    increment = (): void => {
        this.state.count++;
    };

    template = (): Template => tpl`
        <button @click=${this.increment}>count is ${this.state.count}</button>
    `;
}

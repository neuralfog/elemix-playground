import { Component, defineComponent, html, type Template } from '@neuralfog/elemix';
import { state } from '@neuralfog/elemix/state';
import css from './CounterApp.scss?inline';

type State = {
    count: number;
};

export class CounterApp extends Component {
    static styles = [css];

    state = state<State>({ count: 0 });

    increment = (): void => {
        this.state.count++;
    };

    template = (): Template => html`
        <button @click=${this.increment}>count is ${this.state.count}</button>
    `;
}

defineComponent('counter-app', CounterApp);

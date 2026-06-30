import { Component, defineComponent, html, type Template } from '@neuralfog/elemix';
import { state } from '@neuralfog/elemix/state';

import css from './StoreApp.scss?inline';

import './StoreControls';

type State = {
    counter: { value: number };
};

export class StoreApp extends Component {
    static styles = [css];

    state = state<State>({
        counter: { value: 0 },
    });

    template = (): Template => html`
        <p class="note">
            The <code>counter</code> object lives in this parent's reactive
            state and is passed down as a prop. Objects are shared by reference,
            so when the child mutates <code>this.props.counter.value</code>,
            every component subscribed to that object re-renders — including
            this parent.
        </p>
        <div class="readout">
            Parent reads: <strong>${this.state.counter.value}</strong>
        </div>
        <store-controls :counter=${this.state.counter} />
    `;
}

defineComponent('store-app', StoreApp);

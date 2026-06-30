import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';

import css from './StoreApp.scss?inline';
import './StoreControls';

type State = {
    counter: { value: number };
};

// #component
export class StoreApp extends Component {
    // #styles
    styles = css;

    // #state
    state: State = {
        counter: { value: 0 },
    };

    template = (): Template => tpl`
        <p class="note">
            The <code>counter</code> object lives in this parent's reactive
            state and is passed down as a prop. Objects are shared by reference,
            so when the child mutates <code>this.props.counter.value</code>,
            every component subscribed to that object re-renders - including
            this parent.
        </p>
        <div class="readout">
            Parent reads: <strong>${this.state.counter.value}</strong>
        </div>
        <store-controls :counter=${this.state.counter} />
    `;
}

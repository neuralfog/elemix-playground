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
        <div class="readout">
            Parent reads: <strong>${this.state.counter.value}</strong>
        </div>
        <store-controls :counter=${this.state.counter} />
    `;
}

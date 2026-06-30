import { Component, ref, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';

import css from './RefApp.scss?inline';

type State = {
    width: number;
};

// #component
export class RefApp extends Component {
    // #styles
    styles = css;

    input = ref<HTMLInputElement>();

    // #state
    state: State = { width: 0 };

    focusInput = (): void => {
        this.input.value?.focus();
    };

    measure = (): void => {
        this.state.width = this.input.value?.offsetWidth ?? 0;
    };

    template = (): Template => tpl`
        <p class="note">
            <code>:ref</code> binds a DOM node to a <code>ref()</code>. Read the
            element imperatively through <code>this.input.value</code> — here to
            focus the field and measure its width.
        </p>
        <input type="text" :ref=${this.input} placeholder="Type something…" />
        <div class="buttons">
            <button @click=${this.focusInput}>Focus</button>
            <button class="ghost" @click=${this.measure}>Measure width</button>
        </div>
        ${
            this.state.width
                ? tpl`<div class="out">Input is ${this.state.width}px wide</div>`
                : ''
        }
    `;
}

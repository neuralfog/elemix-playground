import { Component, tpl } from '@neuralfog/elemix';
import { repeat } from '@neuralfog/elemix/directives';
import type { Template } from '@neuralfog/elemix/types';

import css from './RatingInput.scss?inline';

type State = {
    value: number;
};

// #component #form
export class RatingInput extends Component {
    // #styles
    styles = css;


    // #state
    state: State = { value: 0 };

    beforeMount(): void {
        this.internals.setFormValue(String(this.state.value));
    }

    set = (n: number): void => {
        this.state.value = n;
        this.internals.setFormValue(String(n));
    };

    template = (): Template => tpl`<div class="stars">
        ${repeat(
            [1, 2, 3, 4, 5],
            (n) => tpl`<button
                type="button"
                class=${{ star: true, on: n <= this.state.value }}
                @click=${() => this.set(n)}
            >★</button>`,
            (n) => String(n),
        )}
    </div>`;
}

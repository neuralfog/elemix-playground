import { Component, defineComponent, html, type Template } from '@neuralfog/elemix';
import { state } from '@neuralfog/elemix/state';
import { repeat } from '@neuralfog/elemix/directives';

import css from './RatingInput.scss?inline';

type State = {
    value: number;
};

export class RatingInput extends Component {
    static styles = [css];

    static formAssociated = true;
    declare internals: ElementInternals;

    state = state<State>({ value: 0 });

    beforeMount(): void {
        this.internals.setFormValue(String(this.state.value));
    }

    set = (n: number): void => {
        this.state.value = n;
        this.internals.setFormValue(String(n));
    };

    template = (): Template => html`<div class="stars">
        ${repeat(
            [1, 2, 3, 4, 5],
            (n) => html`<button
                type="button"
                .class=${{ star: true, on: n <= this.state.value }}
                @click=${() => this.set(n)}
            >★</button>`,
            (n) => String(n),
        )}
    </div>`;
}

defineComponent('rating-input', RatingInput);

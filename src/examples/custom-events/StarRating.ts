import { Component, tpl } from '@neuralfog/elemix';
import { repeat } from '@neuralfog/elemix/directives';
import type { Template } from '@neuralfog/elemix/types';

import css from './StarRating.scss?inline';

const STARS = [1, 2, 3, 4, 5];

type State = { value: number };

// #component
export class StarRating extends Component {
    // #styles
    styles = css;

    // #state
    state: State = { value: 0 };

    pick = (n: number): void => {
        this.state.value = n;
        this.dispatchEvent(new CustomEvent('rate', { detail: n, bubbles: true }));
    };

    template = (): Template => tpl`
        <div class="stars">
            ${repeat(
                STARS,
                (n) => tpl`<button
                    class="star ${n <= this.state.value ? 'on' : ''}"
                    @click=${() => this.pick(n)}
                >★</button>`,
                (n) => n,
            )}
        </div>
    `;
}

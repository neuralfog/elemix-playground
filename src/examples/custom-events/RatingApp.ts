import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';

import css from './RatingApp.scss?inline';
import './StarRating';

type State = { rating: number };

// #component
export class RatingApp extends Component {
    // #styles
    styles = css;

    // #state
    state: State = { rating: 0 };

    onRate = (e: Event): void => {
        this.state.rating = (e as CustomEvent<number>).detail;
    };

    template = (): Template => tpl`
        <p class="note">
            <code>@rate</code> listens for a custom event, just like
            <code>@click</code>. The child fires
            <code>new CustomEvent('rate', { detail })</code> and the parent reads
            <code>e.detail</code> - any event name works, e.g. <code>@my-thing</code>.
        </p>
        <star-rating @rate=${this.onRate} />
        <div class="out">
            ${
                this.state.rating
                    ? tpl`You rated ${this.state.rating} / 5`
                    : 'Pick a rating'
            }
        </div>
    `;
}

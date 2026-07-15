import { Component, tpl } from '@neuralfog/elemix';
import { when } from '@neuralfog/elemix/directives';
import type { Template } from '@neuralfog/elemix/types';

import css from './WhenApp.scss?inline';

type State = {
    open: boolean;
    loggedIn: boolean;
};

// #component
export class WhenApp extends Component {
    // #styles
    styles = css;

    // #state
    state: State = {
        open: false,
        loggedIn: false,
    };

    toggle = (): void => {
        this.state.open = !this.state.open;
    };

    auth = (): void => {
        this.state.loggedIn = !this.state.loggedIn;
    };

    template = (): Template => tpl`
        <div class="bar">
            <button @click=${this.toggle}>
                ${this.state.open ? 'Hide' : 'Show'} details
            </button>
            <button @click=${this.auth}>
                ${this.state.loggedIn ? 'Log out' : 'Log in'}
            </button>
        </div>

        <div class="stage">
            ${when(
                this.state.open,
                () => tpl`<div class="card ready">Here are the details.</div>`,
            )}

            ${when(
                this.state.loggedIn,
                () => tpl`<div class="card ready">✓ Welcome back</div>`,
                () => tpl`<div class="card idle">Please log in</div>`,
            )}
        </div>
    `;
}

import { Component, defineComponent, html, type Template } from '@neuralfog/elemix';
import { state } from '@neuralfog/elemix/state';

import css from './ConditionalApp.scss?inline';

type State = {
    loggedIn: boolean;
    showTip: boolean;
};

export class ConditionalApp extends Component {
    static styles = [css];

    state = state<State>({
        loggedIn: false,
        showTip: true,
    });

    toggleLogin = (): void => {
        this.state.loggedIn = !this.state.loggedIn;
    };

    toggleTip = (): void => {
        this.state.showTip = !this.state.showTip;
    };

    template = (): Template => html`
        <p class="note">
            Conditionals are just JavaScript in the template. A ternary swaps
            between two templates; a ternary with an empty branch
            (<code>: ''</code>) renders nothing.
        </p>

        <div class="panel">
            ${
                this.state.loggedIn
                    ? html`<div class="card welcome">
                          <strong>Welcome back! 🎉</strong>
                          <span>You are signed in.</span>
                      </div>`
                    : html`<div class="card guest">
                          <strong>You are signed out</strong>
                          <span>Sign in to see your dashboard.</span>
                      </div>`
            }

            ${
                this.state.showTip
                    ? html`<div class="tip">💡 Toggle the buttons to watch each branch mount and unmount.</div>`
                    : ''
            }
        </div>

        <div class="buttons">
            <button @click=${this.toggleLogin}>
                ${this.state.loggedIn ? 'Sign out' : 'Sign in'}
            </button>
            <button class="ghost" @click=${this.toggleTip}>
                ${this.state.showTip ? 'Hide tip' : 'Show tip'}
            </button>
        </div>
    `;
}

defineComponent('conditional-app', ConditionalApp);

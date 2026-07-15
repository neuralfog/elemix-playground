import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';

import css from './ConditionalApp.scss?inline';

type State = {
    loggedIn: boolean;
    showTip: boolean;
};

// #component
export class ConditionalApp extends Component {
    // #styles
    styles = css;

    // #state
    state: State = {
        loggedIn: false,
        showTip: true,
    };

    toggleLogin = (): void => {
        this.state.loggedIn = !this.state.loggedIn;
    };

    toggleTip = (): void => {
        this.state.showTip = !this.state.showTip;
    };

    template = (): Template => tpl`
        <div class="panel">
            ${
                this.state.loggedIn
                    ? tpl`<div class="card welcome">
                          <strong>Welcome back! 🎉</strong>
                          <span>You are signed in.</span>
                      </div>`
                    : tpl`<div class="card guest">
                          <strong>You are signed out</strong>
                          <span>Sign in to see your dashboard.</span>
                      </div>`
            }

            ${
                this.state.showTip
                    ? tpl`<div class="tip">💡 Toggle the buttons to watch each branch mount and unmount.</div>`
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

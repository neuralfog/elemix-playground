import { Component, tpl } from '@neuralfog/elemix';
import { choose } from '@neuralfog/elemix/directives';
import type { Template } from '@neuralfog/elemix/types';

import css from './ChooseApp.scss?inline';

type State = {
    score: number;
};

// #component
export class ChooseApp extends Component {
    // #styles
    styles = css;

    // #state
    state: State = {
        score: 72,
    };

    nudge = (delta: number): void => {
        this.state.score = Math.max(0, Math.min(100, this.state.score + delta));
    };

    template = (): Template => tpl`
        <div class="bar">
            <button @click=${() => this.nudge(-5)}>−5</button>
            <span class="score">${this.state.score}</span>
            <button @click=${() => this.nudge(5)}>+5</button>
        </div>

        <div class="stage">
            ${choose([
                [
                    this.state.score >= 90,
                    () => tpl`<div class="card excellent">Excellent</div>`,
                ],
                [
                    this.state.score >= 70,
                    () => tpl`<div class="card good">Good</div>`,
                ],
                [
                    this.state.score >= 40,
                    () => tpl`<div class="card fair">Fair</div>`,
                ],
                [
                    true,
                    () => tpl`<div class="card poor">Needs work</div>`,
                ],
            ])}
        </div>
    `;
}

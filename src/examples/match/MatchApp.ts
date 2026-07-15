import { Component, tpl } from '@neuralfog/elemix';
import { match } from '@neuralfog/elemix/directives';
import type { Template } from '@neuralfog/elemix/types';

import css from './MatchApp.scss?inline';

enum Tab {
    Home = 'home',
    Profile = 'profile',
    Settings = 'settings',
}

type Shape =
    | { kind: 'circle'; radius: number }
    | { kind: 'square'; side: number }
    | { kind: 'rect'; width: number; height: number };

type State = {
    tab: Tab;
    shape: Shape;
};

// #component
export class MatchApp extends Component {
    // #styles
    styles = css;

    // #state
    state: State = {
        tab: Tab.Home,
        shape: { kind: 'circle', radius: 8 },
    };

    setTab = (tab: Tab): void => {
        this.state.tab = tab;
    };

    setShape = (shape: Shape): void => {
        this.state.shape = shape;
    };

    template = (): Template => tpl`
        <section>
            <h3>Over an enum</h3>
            <div class="bar">
                <button @click=${() => this.setTab(Tab.Home)}>Home</button>
                <button @click=${() => this.setTab(Tab.Profile)}>Profile</button>
                <button @click=${() => this.setTab(Tab.Settings)}>Settings</button>
            </div>
            <div class="stage">
                ${match(this.state.tab, {
                    [Tab.Home]: () =>
                        tpl`<div class="card home">🏠 Home feed</div>`,
                    [Tab.Profile]: () =>
                        tpl`<div class="card profile">👤 Your profile</div>`,
                    [Tab.Settings]: () =>
                        tpl`<div class="card settings">⚙️ Settings</div>`,
                })}
            </div>
        </section>

        <section>
            <h3>Over a narrowed object</h3>
            <div class="bar">
                <button @click=${() =>
                    this.setShape({ kind: 'circle', radius: 8 })}>Circle</button>
                <button @click=${() =>
                    this.setShape({ kind: 'square', side: 12 })}>Square</button>
                <button @click=${() =>
                    this.setShape({ kind: 'rect', width: 16, height: 9 })}>Rect</button>
            </div>
            <div class="stage">
                ${match(this.state.shape, 'kind', {
                    circle: (s) =>
                        tpl`<div class="card circle">● Circle - radius ${s.radius}</div>`,
                    square: (s) =>
                        tpl`<div class="card square">■ Square - side ${s.side}</div>`,
                    rect: (s) =>
                        tpl`<div class="card rect">▬ Rect - ${s.width} × ${s.height}</div>`,
                })}
            </div>
        </section>
    `;
}

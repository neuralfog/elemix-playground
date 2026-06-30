import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';

import css from './RenderApp.scss?inline';

// #component
export class RenderApp extends Component {
    // #styles
    styles = css;

    count = 0;

    silent = (): void => {
        this.count++;
    };

    withRender = (): void => {
        this.count++;
        this.render();
    };

    template = (): Template => tpl`
        <p class="note">
            <code>count</code> here is a plain field, not reactive state, so
            mutating it does not re-render. "Increment (silent)" changes the
            value behind the scenes; "Increment + render()" calls
            <code>this.render()</code> to manually flush it to the DOM - watch the
            silent increments catch up. This is ideal when you want full manual
            control over rendering, driving updates yourself without reactive
            state getting in the way.
        </p>
        <div class="value">${this.count}</div>
        <div class="buttons">
            <button class="ghost" @click=${this.silent}>Increment (silent)</button>
            <button @click=${this.withRender}>Increment + render()</button>
        </div>
    `;
}

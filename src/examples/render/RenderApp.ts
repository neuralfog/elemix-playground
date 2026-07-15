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
        <div class="value">${this.count}</div>
        <div class="buttons">
            <button class="ghost" @click=${this.silent}>Increment (silent)</button>
            <button @click=${this.withRender}>Increment + render()</button>
        </div>
    `;
}

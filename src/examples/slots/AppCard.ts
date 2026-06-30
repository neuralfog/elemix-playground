import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';

import css from './AppCard.scss?inline';

// #component
export class AppCard extends Component {
    // #styles
    styles = css;

    template = (): Template => tpl`<div class="card">
        ${
            this.hasSlot('header')
                ? tpl`<div class="header"><slot name="header"></slot></div>`
                : ''
        }
        <div class="body"><slot></slot></div>
        ${
            this.hasSlot('footer')
                ? tpl`<div class="footer"><slot name="footer"></slot></div>`
                : ''
        }
    </div>`;
}

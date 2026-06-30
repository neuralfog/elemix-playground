import { Component, defineComponent, html, type Template } from '@neuralfog/elemix';

import css from './AppCard.scss?inline';

export class AppCard extends Component {
    static styles = [css];

    template = (): Template => html`<div class="card">
        ${
            this.hasSlot('header')
                ? html`<div class="header"><slot name="header"></slot></div>`
                : ''
        }
        <div class="body"><slot></slot></div>
        ${
            this.hasSlot('footer')
                ? html`<div class="footer"><slot name="footer"></slot></div>`
                : ''
        }
    </div>`;
}

defineComponent('app-card', AppCard);

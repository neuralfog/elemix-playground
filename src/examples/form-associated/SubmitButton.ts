import { Component, defineComponent, html, type Template } from '@neuralfog/elemix';

import css from './SubmitButton.scss?inline';

export class SubmitButton extends Component {
    static styles = [css];

    static formAssociated = true;
    declare internals: ElementInternals;

    submit = (): void => {
        this.internals.form?.requestSubmit();
    };

    template = (): Template =>
        html`<button type="button" @click=${this.submit}><slot></slot></button>`;
}

defineComponent('submit-button', SubmitButton);

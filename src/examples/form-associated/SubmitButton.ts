import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';

import css from './SubmitButton.scss?inline';

// #component #form
export class SubmitButton extends Component {
    // #styles
    styles = css;


    submit = (): void => {
        this.internals.form?.requestSubmit();
    };

    template = (): Template =>
        tpl`<button type="button" @click=${this.submit}><slot></slot></button>`;
}

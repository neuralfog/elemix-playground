import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';

import css from './FormApp.scss?inline';
import './RatingInput';
import './SubmitButton';

type State = {
    result: string;
};

// #component
export class FormApp extends Component {
    // #styles
    styles = css;

    // #state
    state: State = { result: '' };

    submit = (e: Event): void => {
        e.preventDefault();
        const data = new FormData(e.target as HTMLFormElement);
        this.state.result = JSON.stringify(Object.fromEntries(data), null, 2);
    };

    template = (): Template => tpl`
        <p class="note">
            The <code>#form</code> compiler hint makes a component
            form-associated - Elemix attaches <code>ElementInternals</code> so it
            can join a native <code>&lt;form&gt;</code>. The star rating and the
            submit button below are both tagged <code>#form</code>, so the form
            sees their values on submit.
        </p>
        <form @submit=${this.submit}>
            <label>
                Name
                <input name="name" type="text" value="Ada" />
            </label>
            <label>
                Rating
                <rating-input name="rating" />
            </label>
            <submit-button>Submit</submit-button>
        </form>
        ${
            this.state.result
                ? tpl`<pre class="out">${this.state.result}</pre>`
                : ''
        }
    `;
}

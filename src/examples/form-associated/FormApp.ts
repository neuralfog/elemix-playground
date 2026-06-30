import { Component, defineComponent, html, type Template } from '@neuralfog/elemix';
import { state } from '@neuralfog/elemix/state';

import css from './FormApp.scss?inline';

import './RatingInput';
import './SubmitButton';

type State = {
    result: string;
};

export class FormApp extends Component {
    static styles = [css];

    state = state<State>({ result: '' });

    submit = (e: Event): void => {
        e.preventDefault();
        const data = new FormData(e.target as HTMLFormElement);
        this.state.result = JSON.stringify(Object.fromEntries(data), null, 2);
    };

    template = (): Template => html`
        <p class="note">
            With <code>static formAssociated = true</code>, Elemix attaches
            <code>ElementInternals</code>. Both the star rating and the submit
            button are custom elements that take part in the native form.
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
                ? html`<pre class="out">${this.state.result}</pre>`
                : ''
        }
    `;
}

defineComponent('form-app', FormApp);

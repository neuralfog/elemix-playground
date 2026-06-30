import { Component, defineComponent, html, type Template } from '@neuralfog/elemix';
import { state } from '@neuralfog/elemix/state';

import css from './DirectApp.scss?inline';

type Toggle = 'active' | 'rounded' | 'large' | 'disabled';

type State = {
    active: boolean;
    rounded: boolean;
    large: boolean;
    disabled: boolean;
};

export class DirectApp extends Component {
    static styles = [css];

    state = state<State>({
        active: true,
        rounded: false,
        large: false,
        disabled: false,
    });

    toggle = (key: Toggle): void => {
        this.state[key] = !this.state[key];
    };

    template = (): Template => html`
        <p class="note">
            The <code>.</code> prefix binds directly to the element.
            <code>.class={...}</code> toggles classes from an object, while
            <code>.prop</code> sets a real DOM property (like <code>.checked</code>
            or <code>.disabled</code>) instead of an attribute.
        </p>

        <div
            .class=${{
                box: true,
                active: this.state.active,
                rounded: this.state.rounded,
                large: this.state.large,
            }}
        >
            .class
        </div>

        <div class="toggles">
            <button @click=${() => this.toggle('active')}>active</button>
            <button @click=${() => this.toggle('rounded')}>rounded</button>
            <button @click=${() => this.toggle('large')}>large</button>
        </div>

        <label class="prop-demo">
            <input
                type="checkbox"
                .checked=${this.state.disabled}
                @change=${() => this.toggle('disabled')}
            />
            Disable the button (<code>.disabled</code>)
        </label>
        <button class="action" .disabled=${this.state.disabled}>Action</button>
    `;
}

defineComponent('direct-app', DirectApp);

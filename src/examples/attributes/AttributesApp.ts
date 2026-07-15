import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';

import css from './AttributesApp.scss?inline';

type Toggle = 'active' | 'rounded' | 'large' | 'disabled';

type State = {
    active: boolean;
    rounded: boolean;
    large: boolean;
    disabled: boolean;
};

// #component
export class AttributesApp extends Component {
    // #styles
    styles = css;

    // #state
    state: State = {
        active: true,
        rounded: false,
        large: false,
        disabled: false,
    };

    toggle = (key: Toggle): void => {
        this.state[key] = !this.state[key];
    };

    template = (): Template => tpl`
        <div
            class=${{
                box: true,
                active: this.state.active,
                rounded: this.state.rounded,
                large: this.state.large,
            }}
        >
            class
        </div>

        <div class="toggles">
            <button @click=${() => this.toggle('active')}>active</button>
            <button @click=${() => this.toggle('rounded')}>rounded</button>
            <button @click=${() => this.toggle('large')}>large</button>
        </div>

        <label class="prop-demo">
            <input
                type="checkbox"
                checked=${this.state.disabled}
                @change=${() => this.toggle('disabled')}
            />
            Disable the button (<code>disabled</code>)
        </label>
        <button class="action" disabled=${this.state.disabled}>Action</button>
    `;
}

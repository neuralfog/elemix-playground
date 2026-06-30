import { Component, defineComponent, html, type Template } from '@neuralfog/elemix';
import { state } from '@neuralfog/elemix/state';
import { ref, type Ref } from '@neuralfog/elemix/utilities';

import css from './ProfileApp.scss?inline';

import './ProfileCard';

type State = {
    name: Ref<string>;
    role: Ref<string>;
    likes: number;
};

export class ProfileApp extends Component {
    static styles = [css];

    state = state<State>({
        name: ref('Ada Lovelace'),
        role: ref('Engineer'),
        likes: 0,
    });

    like = (): void => {
        this.state.likes++;
    };

    template = (): Template => html`
        <div class="controls">
            <label>
                Name
                <input type="text" ~model=${this.state.name} />
            </label>
            <label>
                Role
                <input type="text" ~model=${this.state.role} />
            </label>
            <button @click=${this.like}>👍 Like</button>
        </div>
        <profile-card
            :name=${this.state.name.value}
            :role=${this.state.role.value}
            :likes=${this.state.likes}
        />
    `;
}

defineComponent('profile-app', ProfileApp);

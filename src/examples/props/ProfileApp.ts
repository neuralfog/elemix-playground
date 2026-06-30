import { Component, ref, tpl } from '@neuralfog/elemix';
import type { Ref, Template } from '@neuralfog/elemix/types';

import css from './ProfileApp.scss?inline';
import './ProfileCard';

type State = {
    name: Ref<string>;
    role: Ref<string>;
    likes: number;
};

// #component
export class ProfileApp extends Component {
    // #styles
    styles = css;

    // #state
    state: State = {
        name: ref('Ada Lovelace'),
        role: ref('Engineer'),
        likes: 0,
    };

    like = (): void => {
        this.state.likes++;
    };

    template = (): Template => tpl`
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

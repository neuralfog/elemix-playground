import { Component, defineComponent, html, type Template } from '@neuralfog/elemix';

import css from './ProfileCard.scss?inline';

type Props = {
    name: string;
    role: string;
    likes: number;
};

export class ProfileCard extends Component<Props> {
    static styles = [css];

    template = (): Template => html`<div class="card">
        <div class="avatar">${this.props.name.charAt(0)}</div>
        <div class="info">
            <strong>${this.props.name}</strong>
            <span>${this.props.role}</span>
        </div>
        <div class="likes">❤️ ${this.props.likes}</div>
    </div>`;
}

defineComponent('profile-card', ProfileCard);

import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';

import css from './ProfileCard.scss?inline';

type Props = {
    name: string;
    role: string;
    likes: number;
};

// #component
export class ProfileCard extends Component<Props> {
    // #styles
    styles = css;

    template = (): Template => tpl`<div class="card">
        <div class="avatar">${this.props.name.charAt(0)}</div>
        <div class="info">
            <strong>${this.props.name}</strong>
            <span>${this.props.role}</span>
        </div>
        <div class="likes">❤️ ${this.props.likes}</div>
    </div>`;
}

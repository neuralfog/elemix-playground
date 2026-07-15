import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';

// #component #no-shadow
export class PageAlert extends Component {
    template = (): Template => tpl`
        <div class="alert">
            <strong class="alert__title">Heads up</strong>
            <span class="alert__body">Styled entirely by the page.</span>
        </div>
    `;
}

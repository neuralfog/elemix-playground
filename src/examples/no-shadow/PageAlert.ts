import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';

// #component #no-shadow
export class PageAlert extends Component {
    template = (): Template => tpl`
        <p class="note">
            <code>#no-shadow</code> renders to the light DOM instead of a shadow
            root - no style encapsulation. This component ships no
            <code>#styles</code>; every rule below comes from the host page's
            stylesheet, and the markup is part of the page DOM.
        </p>
        <div class="alert">
            <strong class="alert__title">Heads up</strong>
            <span class="alert__body">Styled entirely by the page.</span>
        </div>
    `;
}

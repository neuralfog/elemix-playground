import { Component, tpl } from '@neuralfog/elemix';
import type { Template } from '@neuralfog/elemix/types';

import css from './LifecycleChild.scss?inline';
import { record } from './store';

type ChildProps = { tick: number };

// #component
export class LifecycleChild extends Component<ChildProps> {
    // #styles
    styles = css;

    // #before-mount
    prepare(): void {
        record('before-mount', 'prepare');
    }

    // #mount
    ready(): void {
        record('mount', 'ready');
    }

    // #dispose
    cleanup(): void {
        record('dispose', 'cleanup');
    }

    template = (): Template => tpl`<div class="child">Child · tick ${this.props.tick}</div>`;
}

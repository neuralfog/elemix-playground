import { Component, defineComponent, html, type Template } from '@neuralfog/elemix';

import css from './LifecycleChild.scss?inline';

import { record } from './store';

type ChildProps = { tick: number };

export class LifecycleChild extends Component<ChildProps> {
    static styles = [css];

    beforeMount(): void {
        record('beforeMount');
    }

    onMount(): void {
        record('onMount');
    }

    onMutation(): void {
        record('onMutation');
    }

    onDispose(): void {
        record('onDispose');
    }

    template = (): Template => html`<div class="child">Child · tick ${this.props.tick}</div>`;
}

defineComponent('lifecycle-child', LifecycleChild);

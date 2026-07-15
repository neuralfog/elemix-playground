import { Component, ref, tpl } from '@neuralfog/elemix';
import type { Ref, Template } from '@neuralfog/elemix/types';

import css from './ModelApp.scss?inline';

const clamp = (v: string): string => {
    const n = Number(v);
    return String(Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 0);
};

type State = {
    name: Ref<string>;
    volume: Ref<string>;
};

// #component
export class ModelApp extends Component {
    // #styles
    styles = css;

    // #state
    state: State = {
        name: ref('Ada'),
        volume: ref('50'),
    };

    template = (): Template => tpl`
        <label>
            Name (<code>~model</code>)
            <input type="text" ~model=${this.state.name} />
        </label>
        <div class="out">Hello, ${this.state.name.value || '…'}</div>

        <label>
            Volume (<code>~model</code> + <code>~onmodel</code>, clamped 0–100)
            <input type="text" ~model=${this.state.volume} ~onmodel=${clamp} />
        </label>
        <div class="out">Volume: ${this.state.volume.value}</div>
    `;
}

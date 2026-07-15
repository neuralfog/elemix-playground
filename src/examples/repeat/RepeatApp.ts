import { Component, tpl } from '@neuralfog/elemix';
import { repeat } from '@neuralfog/elemix/directives';
import type { Template } from '@neuralfog/elemix/types';

import css from './RepeatApp.scss?inline';

type Track = { id: string; title: string };

type State = {
    tracks: Track[];
};

const POOL = [
    'Midnight City',
    'Neon Tide',
    'Afterglow',
    'Redshift',
    'Paper Planes',
    'Solar Fields',
    'Deep Blue',
    'Cascade',
];

// #component
export class RepeatApp extends Component {
    // #styles
    styles = css;

    // #state
    state: State = {
        tracks: [
            { id: crypto.randomUUID(), title: 'Midnight City' },
            { id: crypto.randomUUID(), title: 'Neon Tide' },
            { id: crypto.randomUUID(), title: 'Afterglow' },
        ],
    };

    add = (): void => {
        const title = POOL[Math.floor(Math.random() * POOL.length)];
        this.state.tracks.push({ id: crypto.randomUUID(), title });
    };

    drop = (id: string): void => {
        this.state.tracks = this.state.tracks.filter((t) => t.id !== id);
    };

    shuffle = (): void => {
        const next = [...this.state.tracks];
        for (let i = next.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [next[i], next[j]] = [next[j], next[i]];
        }
        this.state.tracks = next;
    };

    reverse = (): void => {
        this.state.tracks = [...this.state.tracks].reverse();
    };

    template = (): Template => tpl`
        <div class="bar">
            <button @click=${this.add}>+ Add</button>
            <button @click=${this.shuffle}>Shuffle</button>
            <button @click=${this.reverse}>Reverse</button>
        </div>

        <ol class="list">
            ${repeat(
                this.state.tracks,
                (track, i) => tpl`<li class="row">
                    <span class="index">${i + 1}</span>
                    <span class="title">${track.title}</span>
                    <button class="remove" @click=${() =>
                        this.drop(track.id)}>✕</button>
                </li>`,
                (track) => track.id,
            )}
        </ol>
    `;
}

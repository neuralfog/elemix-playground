import { Component, ref, tpl } from '@neuralfog/elemix';
import { repeat } from '@neuralfog/elemix/directives';
import type { Template } from '@neuralfog/elemix/types';

import css from './ChatApp.scss?inline';

type Message = { id: number; text: string; me: boolean };

const REPLIES = ['Got it!', 'Sure thing.', 'On my way.', 'Haha nice.', 'Looks good 👍'];

type State = {
    messages: Message[];
    next: number;
};

// #component
export class ChatApp extends Component {
    // #styles
    styles = css;

    log = ref<HTMLDivElement>();

    // #state
    state: State = {
        messages: [
            { id: 1, text: 'Hey, you around?', me: false },
            { id: 2, text: 'Yep, what is up?', me: true },
            { id: 3, text: 'Pushing the new build now.', me: false },
        ],
        next: 4,
    };

    send = (): void => {
        const id = this.state.next++;
        this.state.messages.push({ id, text: `Message ${id}`, me: true });
        this.state.messages.push({
            id: this.state.next++,
            text: REPLIES[id % REPLIES.length],
            me: false,
        });
    };

    // #effect
    autoscroll(): void {
        const count = this.state.messages.length;
        if (count === 0) return;
        requestAnimationFrame(() => {
            const el = this.log.value;
            if (el) el.scrollTop = el.scrollHeight;
        });
    }

    template = (): Template => tpl`
        <p class="note">
            <code>#effect</code> marks a method that re-runs whenever the reactive
            state it reads changes - use it for side effects or observing changes
            to reactive state. Here <code>autoscroll()</code> reads the messages and
            pins the thread to the bottom after each one
            (<code>scrollTop = scrollHeight</code>).
        </p>
        <div class="log" :ref=${this.log}>
            ${repeat(
                this.state.messages,
                (m) => tpl`<div class="msg ${m.me ? 'me' : 'them'}">${m.text}</div>`,
                (m) => m.id,
            )}
        </div>
        <button @click=${this.send}>Send a message</button>
    `;
}

import { Component, raw, tpl } from '@neuralfog/elemix';
import { repeat } from '@neuralfog/elemix/directives';
import type { Template } from '@neuralfog/elemix/types';

import css from './RawApp.scss?inline';

type Card = { id: string; rank: string; suit: string; red: boolean };

class Deck {
    #cards: Card[] = [];

    constructor() {
        this.shuffle();
    }

    shuffle(): void {
        const suits = ['♠', '♥', '♦', '♣'];
        const ranks = [
            'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K',
        ];
        const cards = suits.flatMap((suit) =>
            ranks.map((rank) => ({
                id: `${rank}${suit}`,
                rank,
                suit,
                red: suit === '♥' || suit === '♦',
            })),
        );
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
        this.#cards = cards;
    }

    draw(): Card | undefined {
        return this.#cards.pop();
    }
}

type State = {
    deck: Deck;
    hand: Card[];
};

// #component
export class RawApp extends Component {
    // #styles
    styles = css;

    // #state
    state: State = {
        deck: raw(new Deck()),
        hand: [],
    };

    deal = (): void => {
        const card = this.state.deck.draw();
        if (card) this.state.hand = [...this.state.hand, card];
    };

    reshuffle = (): void => {
        this.state.deck.shuffle();
        this.state.hand = [];
    };

    template = (): Template => tpl`
        <div class="bar">
            <button @click=${this.deal} disabled=${this.state.hand.length >= 52}>
                Deal card
            </button>
            <button class="ghost" @click=${this.reshuffle}>Reshuffle</button>
            <span class="count">${52 - this.state.hand.length} left</span>
        </div>
        <div class="hand">
            ${repeat(
                this.state.hand,
                (card) => tpl`<span class="card ${card.red ? 'red' : ''}">
                    ${card.rank}${card.suit}
                </span>`,
                (card) => card.id,
            )}
        </div>
    `;
}

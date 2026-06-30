import { Component, defineComponent, html, type Template } from '@neuralfog/elemix';
import { state } from '@neuralfog/elemix/state';
import { repeat } from '@neuralfog/elemix/directives';

import css from './NestedApp.scss?inline';

type Item = { id: string; name: string };
type Category = { id: string; name: string; items: Item[] };

type State = {
    categories: Category[];
};

export class NestedApp extends Component {
    static styles = [css];

    state = state<State>({
        categories: [
            {
                id: 'fruit',
                name: 'Fruit',
                items: [
                    { id: 'apple', name: 'Apple' },
                    { id: 'banana', name: 'Banana' },
                ],
            },
            {
                id: 'veg',
                name: 'Vegetables',
                items: [{ id: 'carrot', name: 'Carrot' }],
            },
        ],
    });

    addItem = (category: Category): void => {
        category.items.push({ id: crypto.randomUUID(), name: 'New item' });
    };

    template = (): Template => html`
        <p class="note">
            <code>repeat</code> nests: the outer loop renders categories, each
            with its own inner <code>repeat</code> of items. Both levels are
            keyed, so adding an item patches only that one list.
        </p>
        <div class="tree">
            ${repeat(
                this.state.categories,
                (category) => html`<div class="category">
                    <div class="head">
                        <strong>${category.name}</strong>
                        <button @click=${() => this.addItem(category)}>+ item</button>
                    </div>
                    <ul>
                        ${repeat(
                            category.items,
                            (item) => html`<li>${item.name}</li>`,
                            (item) => item.id,
                        )}
                    </ul>
                </div>`,
                (category) => category.id,
            )}
        </div>
    `;
}

defineComponent('nested-app', NestedApp);

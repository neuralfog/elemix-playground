import { Component, tpl } from '@neuralfog/elemix';
import { repeat } from '@neuralfog/elemix/directives';
import type { Template } from '@neuralfog/elemix/types';

import css from './NestedApp.scss?inline';

type Item = { id: string; name: string };
type Category = { id: string; name: string; items: Item[] };

type State = {
    categories: Category[];
};

// #component
export class NestedApp extends Component {
    // #styles
    styles = css;

    // #state
    state: State = {
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
    };

    addItem = (category: Category): void => {
        category.items.push({ id: crypto.randomUUID(), name: 'New item' });
    };

    template = (): Template => tpl`
        <p class="note">
            <code>repeat</code> nests: the outer loop renders categories, each
            with its own inner <code>repeat</code> of items. Both levels are
            keyed, so adding an item patches only that one list.
        </p>
        <div class="tree">
            ${repeat(
                this.state.categories,
                (category) => tpl`<div class="category">
                    <div class="head">
                        <strong>${category.name}</strong>
                        <button @click=${() => this.addItem(category)}>+ item</button>
                    </div>
                    <ul>
                        ${repeat(
                            category.items,
                            (item) => tpl`<li>${item.name}</li>`,
                            (item) => item.id,
                        )}
                    </ul>
                </div>`,
                (category) => category.id,
            )}
        </div>
    `;
}

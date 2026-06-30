import { Component, defineComponent, html, type Template } from '@neuralfog/elemix';
import { state } from '@neuralfog/elemix/state';
import { repeat } from '@neuralfog/elemix/directives';
import { ref, type Ref } from '@neuralfog/elemix/utilities';

import css from './TodoApp.scss?inline';

type Todo = { id: string; text: string };

type State = {
    draft: Ref<string>;
    todos: Todo[];
};

export class TodoApp extends Component {
    static styles = [css];

    state = state<State>({
        draft: ref(''),
        todos: [{ id: crypto.randomUUID(), text: 'Learn Elemix' }],
    });

    addItem = (): void => {
        const value = this.state.draft.value.trim();
        if (!value) return;
        this.state.todos.push({ id: crypto.randomUUID(), text: value });
        this.state.draft.value = '';
    };

    removeItem = (id: string): void => {
        const index = this.state.todos.findIndex((todo) => todo.id === id);
        if (index !== -1) this.state.todos.splice(index, 1);
    };

    template = (): Template => html`
        <h3>Todos</h3>
        <div class="row">
            <input
                type="text"
                placeholder="What needs doing?"
                ~model=${this.state.draft}
                @keydown=${(e: KeyboardEvent) => {
                    if (e.key === 'Enter') this.addItem();
                }}
            />
            <button class="add" @click=${this.addItem}>Add</button>
        </div>
        <ul>
            ${repeat(
                this.state.todos,
                (todo) => html`
                    <li>
                        <span>${todo.text}</span>
                        <button class="remove" @click=${() => this.removeItem(todo.id)}>×</button>
                    </li>
                `,
                (todo) => todo.id,
            )}
        </ul>
    `;
}

defineComponent('todo-app', TodoApp);

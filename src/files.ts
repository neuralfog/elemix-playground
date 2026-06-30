export type Files = Record<string, string>;

export interface App {
    id: string;
    name: string;
    files: Files;
}

export const ENTRY = 'main.ts';

// The ordered index of every example. Each entry maps to a folder under
// `examples/<id>/`, where the sources live as real files (edit them there, not
// here). `files` is the tab order: `main.ts` (the ENTRY) first, then each
// component before its stylesheet.
const MANIFEST: { id: string; name: string; files: string[] }[] = [
    {
        id: 'counter',
        name: 'Counter',
        files: ['main.ts', 'CounterApp.ts', 'CounterApp.scss'],
    },
    {
        id: 'todo',
        name: 'Todo App',
        files: ['main.ts', 'TodoApp.ts', 'TodoApp.scss'],
    },
    {
        id: 'two-way-binding',
        name: 'Two-Way Binding',
        files: ['main.ts', 'ModelApp.ts', 'ModelApp.scss'],
    },
    {
        id: 'props',
        name: 'Props',
        files: [
            'main.ts',
            'ProfileApp.ts',
            'ProfileApp.scss',
            'ProfileCard.ts',
            'ProfileCard.scss',
        ],
    },
    {
        id: 'state-in-props',
        name: 'State in Props',
        files: [
            'main.ts',
            'StoreApp.ts',
            'StoreApp.scss',
            'StoreControls.ts',
            'StoreControls.scss',
        ],
    },
    {
        id: 'stores',
        name: 'Stores',
        files: [
            'main.ts',
            'store.ts',
            'StoreApp.ts',
            'StoreApp.scss',
            'StoreValue.ts',
            'StoreValue.scss',
            'StoreButtons.ts',
            'StoreButtons.scss',
        ],
    },
    {
        id: 'render',
        name: 'render()',
        files: ['main.ts', 'RenderApp.ts', 'RenderApp.scss'],
    },
    {
        id: 'attributes',
        name: 'Attributes',
        files: ['main.ts', 'AttributesApp.ts', 'AttributesApp.scss'],
    },
    {
        id: 'conditionals',
        name: 'Conditionals',
        files: ['main.ts', 'ConditionalApp.ts', 'ConditionalApp.scss'],
    },
    {
        id: 'when-choose',
        name: 'When / Choose',
        files: ['main.ts', 'StatusApp.ts', 'StatusApp.scss'],
    },
    {
        id: 'lifecycle',
        name: 'Lifecycle',
        files: [
            'main.ts',
            'LifecycleApp.ts',
            'LifecycleApp.scss',
            'LifecycleChild.ts',
            'LifecycleChild.scss',
            'LogView.ts',
            'LogView.scss',
            'store.ts',
        ],
    },
    {
        id: 'effects',
        name: 'Effects',
        files: ['main.ts', 'ChatApp.ts', 'ChatApp.scss'],
    },
    {
        id: 'refs',
        name: 'Refs',
        files: ['main.ts', 'RefApp.ts', 'RefApp.scss'],
    },
    {
        id: 'no-shadow',
        name: 'No Shadow',
        files: ['main.ts', 'PageAlert.ts', 'page.scss'],
    },
    {
        id: 'custom-events',
        name: 'Custom Events',
        files: [
            'main.ts',
            'RatingApp.ts',
            'RatingApp.scss',
            'StarRating.ts',
            'StarRating.scss',
        ],
    },
    {
        id: 'event-bus',
        name: 'Event Bus',
        files: [
            'main.ts',
            'bus.ts',
            'BusApp.ts',
            'BusApp.scss',
            'NotifyControls.ts',
            'NotifyControls.scss',
            'NotifyFeed.ts',
            'NotifyFeed.scss',
        ],
    },
    {
        id: 'slots',
        name: 'Slots',
        files: [
            'main.ts',
            'SlotApp.ts',
            'SlotApp.scss',
            'AppCard.ts',
            'AppCard.scss',
        ],
    },
    {
        id: 'nested-lists',
        name: 'Nested Lists',
        files: ['main.ts', 'NestedApp.ts', 'NestedApp.scss'],
    },
    {
        id: 'form-associated',
        name: 'Form Control',
        files: [
            'main.ts',
            'FormApp.ts',
            'FormApp.scss',
            'RatingInput.ts',
            'RatingInput.scss',
            'SubmitButton.ts',
            'SubmitButton.scss',
        ],
    },
];

// Slurp every example source as raw text at build time. Keyed by path, e.g.
// './examples/counter/main.ts'.
const RAW = import.meta.glob('./examples/*/*', {
    query: '?raw',
    eager: true,
    import: 'default',
}) as Record<string, string>;

export const APPS: App[] = MANIFEST.map(({ id, name, files }) => ({
    id,
    name,
    files: Object.fromEntries(
        files.map((file) => {
            const key = `./examples/${id}/${file}`;
            const source = RAW[key];
            if (source === undefined) {
                throw new Error(`missing example source: ${key}`);
            }
            return [file, source];
        }),
    ),
}));

export const DEFAULT_APP = APPS[0];

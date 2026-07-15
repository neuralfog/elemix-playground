export type Files = Record<string, string>;

export interface App {
    id: string;
    name: string;
    files: Files;
}

export interface Category {
    id: string;
    name: string;
    apps: App[];
}

export const ENTRY = 'main.ts';

// The ordered index of every example, grouped into categories. Two orderings
// are controlled here and nowhere else: the CATEGORIES array order is the
// dropdown group order (top to bottom), and each category's `examples` order
// is the order within that group. To reshuffle, move entries here.
//
// Each example maps to a folder under `examples/<id>/`, where the sources live
// as real files (edit them there, not here). `files` is the tab order:
// `main.ts` (the ENTRY) first, then each component before its stylesheet.
interface Entry {
    id: string;
    name: string;
    files: string[];
}

const CATEGORIES: { id: string; name: string; examples: Entry[] }[] = [
    {
        id: 'state',
        name: 'State',
        examples: [
            {
                id: 'counter',
                name: 'Local State',
                files: ['main.ts', 'CounterApp.ts', 'CounterApp.scss'],
            },
            {
                id: 'stores',
                name: 'Global State (stores)',
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
                id: 'raw',
                name: 'Raw',
                files: ['main.ts', 'RawApp.ts', 'RawApp.scss'],
            },
            {
                id: 'effects',
                name: 'Effects',
                files: ['main.ts', 'ChatApp.ts', 'ChatApp.scss'],
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
        ],
    },
    {
        id: 'templates',
        name: 'Templates',
        examples: [
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
                id: 'two-way-binding',
                name: 'Two-Way Binding',
                files: ['main.ts', 'ModelApp.ts', 'ModelApp.scss'],
            },
            {
                id: 'refs',
                name: 'Refs',
                files: ['main.ts', 'RefApp.ts', 'RefApp.scss'],
            },
        ],
    },
    {
        id: 'directives',
        name: 'Directives',
        examples: [
            {
                id: 'when',
                name: 'When',
                files: ['main.ts', 'WhenApp.ts', 'WhenApp.scss'],
            },
            {
                id: 'choose',
                name: 'Choose',
                files: ['main.ts', 'ChooseApp.ts', 'ChooseApp.scss'],
            },
            {
                id: 'match',
                name: 'Match',
                files: ['main.ts', 'MatchApp.ts', 'MatchApp.scss'],
            },
            {
                id: 'repeat',
                name: 'Repeat',
                files: ['main.ts', 'RepeatApp.ts', 'RepeatApp.scss'],
            },
        ],
    },
    {
        id: 'components',
        name: 'Component',
        examples: [
            {
                id: 'render',
                name: 'Manual Render',
                files: ['main.ts', 'RenderApp.ts', 'RenderApp.scss'],
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
                id: 'custom-events',
                name: 'Custom Events',
                files: [
                    'main.ts',
                    'CartApp.ts',
                    'CartApp.scss',
                    'CartItem.ts',
                    'CartItem.scss',
                ],
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
                id: 'no-shadow',
                name: 'No Shadow',
                files: ['main.ts', 'PageAlert.ts', 'page.scss'],
            },
        ],
    },
    {
        id: 'forms',
        name: 'Forms',
        examples: [
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
        ],
    },
    {
        id: 'showcase',
        name: 'Examples',
        examples: [
            {
                id: 'todo',
                name: 'Todo App',
                files: ['main.ts', 'TodoApp.ts', 'TodoApp.scss'],
            },
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

const buildApp = ({ id, name, files }: Entry): App => ({
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
});

export const CATEGORISED: Category[] = CATEGORIES.map(
    ({ id, name, examples }) => ({
        id,
        name,
        apps: examples.map(buildApp),
    }),
);

// Flat, order-preserved view for hash routing and the default selection.
export const APPS: App[] = CATEGORISED.flatMap((c) => c.apps);

export const DEFAULT_APP = APPS[0];

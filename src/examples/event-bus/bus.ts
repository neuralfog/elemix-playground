export type Notification = {
    id: number;
    text: string;
    kind: 'info' | 'success' | 'warn';
};

export type Events = {
    notify: Notification;
};

type Handler<T> = (payload: T) => void;

class EventBus {
    private handlers = new Map<keyof Events, Set<Handler<unknown>>>();

    on<E extends keyof Events>(event: E, handler: Handler<Events[E]>): () => void {
        let set = this.handlers.get(event);
        if (!set) {
            set = new Set();
            this.handlers.set(event, set);
        }
        set.add(handler as Handler<unknown>);
        return () => {
            set.delete(handler as Handler<unknown>);
        };
    }

    emit<E extends keyof Events>(event: E, payload: Events[E]): void {
        this.handlers.get(event)?.forEach((handler) => handler(payload));
    }
}

export const bus = new EventBus();

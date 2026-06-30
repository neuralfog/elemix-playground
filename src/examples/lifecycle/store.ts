import { signal } from '@neuralfog/elemix/signal';

export type LogEntry = { id: number; event: string };

export const log = signal<{ entries: LogEntry[] }>({ entries: [] });

let seq = 0;

export const record = (event: string): void => {
    seq++;
    log.value.entries.push({ id: seq, event });
};

export const clearLog = (): void => {
    seq = 0;
    log.value.entries.splice(0);
};

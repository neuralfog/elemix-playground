export type LogEntry = { id: number; hint: string; fn: string };

// #state
export const log: { entries: LogEntry[] } = { entries: [] };

let seq = 0;

export const record = (hint: string, fn: string): void => {
    seq++;
    log.entries.push({ id: seq, hint, fn });
};

export const clearLog = (): void => {
    seq = 0;
    log.entries.splice(0);
};

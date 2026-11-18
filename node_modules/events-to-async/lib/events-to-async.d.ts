export type EventToAsyncUnHandler = () => unknown;
export type EventToAsyncOnOptions = {
    signal?: AbortSignal;
};
export declare function on<R extends [...any]>(onHandler: (...arg: any[]) => EventToAsyncUnHandler, options?: EventToAsyncOnOptions): AsyncIterableIterator<R>;
export type EventToAsyncOnceOptions = {
    signal?: AbortSignal;
};
export declare function once<R extends [...any]>(onHandler: (...arg: any[]) => EventToAsyncUnHandler, options?: EventToAsyncOnceOptions): Promise<R>;
//# sourceMappingURL=events-to-async.d.ts.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.once = exports.on = void 0;
function createDeferred() {
    let resolve;
    let reject;
    const promise = new Promise((...args) => ([resolve, reject] = args));
    return Object.freeze({
        resolve: resolve,
        reject: reject,
        promise
    });
}
function on(onHandler, options) {
    const comEvents = [];
    const unconsumedDeferred = [];
    const unHandle = onHandler((...args) => {
        const deferred = unconsumedDeferred.shift();
        if (deferred) {
            deferred.resolve({
                value: args,
                done: false
            });
        }
        else {
            comEvents.push(args);
        }
    });
    const abortSignal = options === null || options === void 0 ? void 0 : options.signal;
    let finished = false;
    let error = null;
    const onAbort = () => {
        error = new Error("Abort Error");
    };
    const offListener = () => {
        unHandle === null || unHandle === void 0 ? void 0 : unHandle();
        abortSignal === null || abortSignal === void 0 ? void 0 : abortSignal.removeEventListener("abort", onAbort);
    };
    abortSignal === null || abortSignal === void 0 ? void 0 : abortSignal.addEventListener("abort", onAbort, { once: true });
    return {
        async next() {
            const lastEvent = comEvents.shift();
            if (lastEvent) {
                return {
                    value: lastEvent,
                    done: false
                };
            }
            if (finished) {
                return {
                    value: undefined,
                    done: true
                };
            }
            if (error) {
                return Promise.reject(error);
            }
            const deferred = createDeferred();
            unconsumedDeferred.push(deferred);
            return deferred.promise;
        },
        async return() {
            finished = true;
            offListener();
            for (const deferred of unconsumedDeferred) {
                deferred.resolve({
                    value: undefined,
                    done: true
                });
            }
            return {
                value: undefined,
                done: true
            };
        },
        async throw(thrownError) {
            error = thrownError;
            offListener();
            return {
                value: undefined,
                done: true
            };
        },
        [Symbol.asyncIterator]() {
            return this;
        }
    };
}
exports.on = on;
function once(onHandler, options) {
    var _a;
    const unconsumedDeferred = createDeferred();
    const unEvent = onHandler((...args) => {
        unconsumedDeferred.resolve(args);
    });
    const onAbort = () => {
        unconsumedDeferred.reject(new Error("Abort Error"));
    };
    const offListener = () => {
        var _a;
        unEvent === null || unEvent === void 0 ? void 0 : unEvent();
        (_a = options === null || options === void 0 ? void 0 : options.signal) === null || _a === void 0 ? void 0 : _a.removeEventListener("abort", onAbort);
    };
    (_a = options === null || options === void 0 ? void 0 : options.signal) === null || _a === void 0 ? void 0 : _a.addEventListener("abort", onAbort, { once: true });
    return unconsumedDeferred.promise.finally(() => {
        offListener();
    });
}
exports.once = once;
//# sourceMappingURL=events-to-async.js.map
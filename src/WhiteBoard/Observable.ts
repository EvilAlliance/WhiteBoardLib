export type TEventCallback<T = any> = (options: T) => void;

export function on<T, K extends keyof T>(obj: { eventListener: Record<keyof T, TEventCallback[]> }, evtName: K, handler: TEventCallback<T[K]>) {
    if (!obj.eventListener[evtName]) {
        obj.eventListener[evtName] = [];
    }
    obj.eventListener[evtName].push(handler);
    return () => off(obj, evtName, handler);
}

export function once<T, K extends keyof T>(obj: { eventListener: Record<keyof T, TEventCallback[]> }, evtName: K, handler: TEventCallback<T[K]>) {
    const disposer = on(obj, evtName, function onceHandler(...args) {
        handler.bind(obj)(...args);
        disposer();
    });
    return disposer;
}

export function removeEventListener<T, K extends keyof T>(obj: { eventListener: Record<keyof T, TEventCallback[]> }, eventName: K, handler?: TEventCallback<T[K]>) {
    if (!handler) {
        obj.eventListener[eventName] = [];
    } else {
        const eventListener = obj.eventListener[eventName];
        const index = eventListener.indexOf(handler);
        index > -1 && eventListener.splice(index, 1);
    }
}

export function off<T, K extends keyof T>(obj: { eventListener: Record<keyof T, TEventCallback[]> }, arg0: K, handler: TEventCallback<T[K]>) {
    if (!arg0) {
        for (const eventName in obj.eventListener) {
            removeEventListener(obj, eventName);
        }
    } else {
        removeEventListener(obj, arg0, handler);
    }
}

export function fire<T, K extends keyof T>(obj: { eventListener: Record<keyof T, TEventCallback[]> }, eventName: K, options: T[K]) {
    const events = obj.eventListener[eventName] || [];
    for (let i = 0; i < events.length; i++) {
        events[i].bind(obj)(options || {});
    }
}

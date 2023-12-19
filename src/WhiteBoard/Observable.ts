export type TEventCallback<T = any> = (options: T) => any;

export function on<T>(obj: { eventListener: Record<keyof T, TEventCallback[]> }, arg0: Partial<Record<keyof T, TEventCallback<T[keyof T]>>> | keyof T, handler?: TEventCallback<T[keyof T]>) {
    if (typeof arg0 == 'object') {
        for (const [eventName, handler] of Object.entries(arg0)) {
            on(obj, eventName as keyof T, handler as TEventCallback<T[keyof T]>);
        }
        return () => off(obj, arg0);
    } else if (handler) {
        if (!obj.eventListener[arg0]) {
            obj.eventListener[arg0] = [];
        }
        obj.eventListener[arg0].push(handler);
        return () => off(obj, arg0, handler);
    }
    return () => false;
}

export function once<T>(obj: { eventListener: Record<keyof T, TEventCallback[]> }, arg0: Partial<Record<keyof T, TEventCallback<keyof T>>> | keyof T, handler?: TEventCallback<T[keyof T]>) {
    if (typeof arg0 === 'object') {
        const disposers: VoidFunction[] = [];
        for (const [eventName, handler] of Object.entries(arg0)) {
            disposers.push(once(obj, eventName as keyof T, handler as TEventCallback<T[keyof T]>));
        }
        return () => disposers.forEach((d) => d());
    } else if (handler) {
        const disposer = on(obj, arg0, function onceHandler(...args) {
            handler.bind(obj)(...args);
            disposer();
        });
        return disposer;
    } else {
        return () => false;
    }
}

export function removeEventListener<T>(obj: { eventListener: Record<keyof T, TEventCallback[]> }, eventName: keyof T, handler?: TEventCallback<T[keyof T]>) {
    if (!handler) {
        obj.eventListener[eventName] = [];
    } else {
        const eventListener = obj.eventListener[eventName];
        const index = eventListener.indexOf(handler);
        index > -1 && eventListener.splice(index, 1);
    }
}

export function off<T>(obj: { eventListener: Record<keyof T, TEventCallback[]> }, arg0: Partial<Record<keyof T, TEventCallback<T[keyof T]>>> | keyof T, handler?: TEventCallback<T[keyof T]>) {
    if (!arg0) {
        for (const eventName in obj.eventListener) {
            removeEventListener(obj, eventName);
        }
    } else if (typeof arg0 == 'object') {
        for (const [eventName, handler] of Object.entries(arg0)) {
            removeEventListener(obj, eventName as keyof T, handler as TEventCallback<T[keyof T]>);
        }
    } else {
        removeEventListener(obj, arg0, handler);
    }
}

export function fire<T>(obj: { eventListener: Record<keyof T, TEventCallback[]> }, eventName: keyof T, options: T[keyof T]) {
    const events = obj.eventListener[eventName] || [];
    for (let i = 0; i < events.length; i++) {
        events[i].bind(obj)(options || {});
    }
}

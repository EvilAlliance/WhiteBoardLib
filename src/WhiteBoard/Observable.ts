export type TEventCallback<T = any> = (options: T) => void;

export class Observable<T = Object>{
    eventListener: Record<keyof T, TEventCallback[]> = {} as Record<keyof T, TEventCallback[]>;

    on<K extends keyof T = keyof T>(evtName: K, handler: TEventCallback<T[K]>): VoidFunction {
        this.eventListener[evtName].push(handler);
        return () => this.off(evtName, handler);
    }

    once<K extends keyof T = keyof T>(evtName: K, handler: TEventCallback<T[K]>) {
        const disposer = this.on(evtName, function onceHandler(...args) {
            handler(...args);
            disposer();
        });
        return disposer;
    }
    removeEventListener<K extends keyof T>(eventName: K, handler?: TEventCallback<T[K]>) {
        if (!handler) {
            this.eventListener[eventName] = [];
        } else {
            const eventListener = this.eventListener[eventName];
            const index = eventListener.indexOf(handler);
            index > -1 && eventListener.splice(index, 1);
        }
    }

    off<K extends keyof T>(arg0: K, handler: TEventCallback<T[K]>) {
        if (!arg0) {
            for (const eventName in this.eventListener) {
                this.removeEventListener(eventName);
            }
        } else {
            this.removeEventListener(arg0, handler);
        }
    }

    fire<K extends keyof T>(eventName: K, options: T[K]) {
        const events = this.eventListener[eventName] || [];
        for (let i = 0; i < events.length; i++) {
            events[i](options || {});
        }
    }
}

export type TEventCallback<T = any> = (options: T) => void;

export class Observable<T = Object>{
    eventListener: Map<keyof T, TEventCallback[]> = new Map<keyof T, TEventCallback[]>();

    on<K extends keyof T = keyof T>(evtName: K, handler: TEventCallback<T[K]>): VoidFunction {
        if (!this.eventListener.has(evtName)) this.eventListener.set(evtName, []);
        (this.eventListener.get(evtName) as TEventCallback[]).push(handler);
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
            this.eventListener.set(eventName, []);
        } else {
            const eventListener = this.eventListener.get(eventName);
            if (!eventListener) return;
            const index = eventListener.indexOf(handler);
            index > -1 && eventListener.splice(index, 1);
        }
    }

    off<K extends keyof T>(arg0: K, handler: TEventCallback<T[K]>) {
        if (!arg0) {
            for (const eventName of this.eventListener.keys()) {
                this.removeEventListener(eventName);
            }
        } else {
            this.removeEventListener(arg0, handler);
        }
    }

    fire<K extends keyof T>(eventName: K, options: T[K]) {
        const events = this.eventListener.get(eventName) || [];
        for (let i = 0; i < events.length; i++) {
            events[i].call(this, options || {});
        }
    }
}

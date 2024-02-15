import { Observable, TEventCallback } from '../Observable';
import { BaseObject } from './BaseObject';

export type CanvasObjectContainerEvent = {
    'render:Before': null;
    'render:After': null;
}

export class CanvasObjectContainer extends Observable<CanvasObjectContainerEvent> {
    public render: boolean;
    public Object: BaseObject;
    constructor(obj: BaseObject) {
        super();
        this.render = true;
        this.eventListener = {} as Record<keyof CanvasObjectContainerEvent, TEventCallback<CanvasObjectContainerEvent[keyof CanvasObjectContainerEvent]>[]>;
        this.Object = obj;
    }
}

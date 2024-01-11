import { TEventCallback } from '../Observable';
import { BaseObject } from './BaseObject';

export type CanvasObjectContainerEvent = {
    'render:Before': null;
    'render:After': null;
}

export class CanvasObjectContainer {
    public render: boolean;
    public eventListener: Record<keyof CanvasObjectContainerEvent, TEventCallback<CanvasObjectContainerEvent[keyof CanvasObjectContainerEvent]>[]>;
    public Object: BaseObject;
    constructor(obj: BaseObject) {
        this.render = true;
        this.eventListener = {} as Record<keyof CanvasObjectContainerEvent, TEventCallback<CanvasObjectContainerEvent[keyof CanvasObjectContainerEvent]>[]>;
        this.Object = obj;
    }
}

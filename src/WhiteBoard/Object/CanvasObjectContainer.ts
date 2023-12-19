import { TEventCallback } from '../Observable';
import { CanvasObject } from './CanvasObject';

export type CanvasObjectContainerEvent = {
    'render:Before': void;
    'render:After': void;
}

export class CanvasObjectContainer {
    public render: boolean;
    public eventListener: Record<keyof CanvasObjectContainerEvent, TEventCallback<CanvasObjectContainerEvent[keyof CanvasObjectContainerEvent]>[]>;
    public Object: CanvasObject;
    constructor(obj: CanvasObject) {
        this.render = true;
        this.eventListener = {} as Record<keyof CanvasObjectContainerEvent, TEventCallback<CanvasObjectContainerEvent[keyof CanvasObjectContainerEvent]>[]>;
        this.Object = obj;
    }
}

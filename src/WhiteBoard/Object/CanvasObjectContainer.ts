import { Observable } from '../Observable';
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
        this.Object = obj;
    }
}

import { CanvasObject } from './CanvasObject';

export class CanvasObjectContainer {
    public render: boolean;
    public eventListener: any;
    public Object: CanvasObject;
    constructor(obj: CanvasObject) {
        this.render = true;
        this.eventListener = {};
        this.Object = obj;
    }
}

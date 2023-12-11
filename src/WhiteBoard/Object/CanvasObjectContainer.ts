import { CanvasObject } from "./CanvasObject";

export class CanvasObjectContainer {
    public render: boolean;
    public name: string;
    public eventListener: any;
    public Object: CanvasObject;
    constructor(obj: CanvasObject, name: string) {
        this.render = true;
        this.name = name;
        this.eventListener = {};
        this.Object = obj;
    }
}

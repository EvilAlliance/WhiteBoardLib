export class CanvasObject {
    public render: boolean;
    public name: string;
    public eventListener: any;
    public Object: any;
    constructor(obj: any, name: string) {
        this.render = true;
        this.name = name;
        this.eventListener = {};
        this.Object = obj;
    }
}

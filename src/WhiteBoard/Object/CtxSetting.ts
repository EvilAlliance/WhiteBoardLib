import { CanvasParseColor, Color } from '../Utils/Color';

export class CtxSetting {
    lineCap: CanvasLineCap = 'round';
    strokeWidth: number = 0;
    strokeColor: Color = 'Red';
    fill: boolean = false;
    fillColor: Color = 'Red';
    globalCompositeOperation: GlobalCompositeOperation = 'source-over';
    constructor(obj?: Partial<CtxSetting>) {
        Object.assign(this, obj);
    }

    setSettingSetContextOption(ctx: CanvasRenderingContext2D) {
        ctx.lineCap = this.lineCap;
        ctx.lineWidth = this.strokeWidth;
        ctx.strokeStyle = CanvasParseColor(this.strokeColor);

        ctx.fillStyle = CanvasParseColor(this.fillColor);

        ctx.globalCompositeOperation = this.globalCompositeOperation;
    }

    copy(): CtxSetting {
        return new CtxSetting(this);
    }
}

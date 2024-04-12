import CommonMethod from '../CommonMethod';
import { CanvasParseColor, Color } from '../Utils/Color';

export class CtxSetting extends CommonMethod {
    lineCap: CanvasLineCap = 'round';
    strokeWidth: number = 0;
    strokeColor: Color = 'Red';
    fill: boolean = false;
    fillColor: Color = 'Red';
    globalCompositeOperation: GlobalCompositeOperation = 'source-over';
    dirty: boolean = true;

    constructor(obj?: Partial<CtxSetting>) {
        super();
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

    set<T extends keyof this>(key: Partial<this> | T, value?: this[T] | undefined): this {
        this.dirty = true;
        return super.set(key, value);
    }
}

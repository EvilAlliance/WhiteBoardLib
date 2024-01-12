import { Canvas, CanvasClear, CanvasRender } from '../Canvas';
import { BaseObject, OriginXY } from '../Object/BaseObject';
import { ColorRGBA, ColorRGBAParse, ColorRGBAToParse } from '../Utils/Color';
import { Transitions } from './Transition';

export function animate<T extends BaseObject, K extends keyof T>(canvas: Canvas, obj: T, prop: K, fromValue: T[K], toValue: T[K], Duration: number, Type: keyof typeof Transitions) {
    console.log('TODO: Dont know how to arrange all the cases', arguments);
    return;
    if (Duration < 0) return;

    if (prop == 'originX' || prop == 'originY') {
        fromValue = OriginXY[fromValue as keyof typeof OriginXY] ?? fromValue;
        toValue = OriginXY[toValue as keyof typeof OriginXY] ?? toValue;
    }

    if ((prop == 'fillColor' || prop == 'strokeColor') && typeof obj[prop] == 'string') {
        animateColor(
            canvas,
            obj,
            prop,
            ColorRGBAToParse(fromValue as string),
            ColorRGBAToParse(toValue as string),
            Duration,
            Type,
        );
    }

    if (typeof toValue == 'boolean' && typeof fromValue == 'boolean' && typeof obj[prop] == 'boolean') {
        obj[prop] = true as never;
        const fillColor = ColorRGBAToParse(
            obj.fillColor ?? 'rgb(255, 255, 255, 0)',
        );
        const toFillColor = fillColor.slice() as ColorRGBA;
        fillColor[3] = fromValue ? 1 : 0;
        toFillColor[3] = toValue ? 1 : 0;
        animateColor(
            canvas,
            obj,
            'fillColor',
            fillColor,
            toFillColor,
            Duration,
            Type,
        );
        return;
    }

    if (typeof toValue == 'number' && typeof fromValue == 'number' && typeof obj[prop] == 'number')
        animateNumber(canvas, obj, prop, fromValue, toValue, Duration, Type);
}

function animateNumber(canvas: Canvas, obj: CanvasObject, prop: keyof CanvasObject, fromNumber: number, toNumber: number, Duration: number, Type: keyof typeof Transitions) {
    obj[prop] = fromNumber as never;

    window.requestAnimationFrame(changeAnimateN);

    function changeAnimateN(l: number) {
        CanvasClear(canvas);
        obj[prop] = (fromNumber + (toNumber - fromNumber) * Transitions[Type](l / Duration)) as never;
        CanvasRender(canvas);
        if (l < Duration) window.requestAnimationFrame(changeAnimateN);
    }
}

function animateColor(canvas: Canvas, obj: CanvasObject, prop: keyof CanvasObject, fromColor: ColorRGBA, toColor: ColorRGBA, Duration: number, Type: keyof typeof Transitions) {
    obj[prop] = ColorRGBAParse(fromColor) as never;

    window.requestAnimationFrame(changeAnimateA);
    function changeAnimateA(l: number) {
        if (l > Duration) return;
        CanvasClear(canvas);
        const NColor = [0, 0, 0, 0] as ColorRGBA;
        for (let i = 0; i < NColor.length; i++) {
            NColor[i] =
                fromColor[i] +
                (toColor[i] - fromColor[i]) * Transitions[Type](l / Duration);
        }
        obj[prop] = ColorRGBAParse(NColor) as never;
        CanvasRender(canvas);
        if (l < Duration) window.requestAnimationFrame(changeAnimateA);
    }
}

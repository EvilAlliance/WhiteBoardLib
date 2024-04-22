import ColorJSON from './../Constantes/Color.json';

type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;

export type ColorString = RGB | RGBA | HEX;

export type Color = ColorString | keyof typeof ColorJSON;

export function CanvasParseColor(x: Color): Color {
    return ColorJSON[x as keyof typeof ColorJSON] as ColorString ?? x;
}

export type ColorRGBA = [number, number, number, number];
export type ColorRGB = [number, number, number];
export type ColorXYZ = [number, number, number];
export type ColorLAB = [number, number, number];
export type ColorLCH = [number, number, number];

export function ColorRGBAToParse(x: string): ColorRGBA {
    if (x[0] === '#') return hexToColorRGBA(x);
    if (x[0] === 'r') return rgbToColorRGBA(x);
    return hexToColorRGBA(ColorJSON[x as keyof typeof ColorJSON]);
}

function hexToColorRGBA(hex: string): ColorRGBA {
    const r = parseInt(hex.slice(1, 3), 16) || 0;
    const b = parseInt(hex.slice(3, 5), 16) || 0;
    const g = parseInt(hex.slice(5, 7), 16) || 0;
    const a = parseInt(hex.slice(7, 9), 16) || 1;
    return [r, b, g, a];
}

function rgbToColorRGBA(rgb: string): ColorRGBA {
    const x = rgb.slice(4, rgb.length - 1);
    const a = x.split(',');
    return [
        parseInt(a[0]) || 0,
        parseInt(a[1]) || 0,
        parseInt(a[2]) || 0,
        parseInt(a[3]) || 1,
    ];
}

export function ColorRGBAParse(x: ColorRGBA): string {
    return `rgb(${x[0]},${x[1]},${x[2]},${x[3]})`;
}

export function ColorRGBToParse(x: string): ColorRGB {
    if (x[0] === '#') return hexToColorRGB(x);
    if (x[0] === 'r') return rgbToColorRGB(x);
    return hexToColorRGB(ColorJSON[x as keyof typeof ColorJSON]);
}

function hexToColorRGB(hex: string): ColorRGB {
    const r = parseInt(hex.slice(1, 3), 16) || 0;
    const b = parseInt(hex.slice(3, 5), 16) || 0;
    const g = parseInt(hex.slice(5, 7), 16) || 0;
    return [r, b, g];
}

function rgbToColorRGB(rgb: string): ColorRGB {
    const x = rgb.slice(4, rgb.length - 1);
    const a = x.split(',');
    return [
        parseInt(a[0]) || 0,
        parseInt(a[1]) || 0,
        parseInt(a[2]) || 0,
    ];
}

export function ColorRGBToXYZ(x: ColorRGB): ColorXYZ {
    // Convert all components to linear RGB.
    const r = gamma_expansion(x[0]);
    const g = gamma_expansion(x[1]);
    const b = gamma_expansion(x[2]);

    // Switch to XYZ.
    return [
        r * 0.4124108464885388 + g * 0.3575845678529519 + b * 0.18045380393360833,
        r * 0.21264934272065283 + g * 0.7151691357059038 + b * 0.07218152157344333,
        r * 0.019331758429150258 + g * 0.11919485595098397 + b * 0.9503900340503373,
    ]
}

function gamma_expansion(value255: number): number {
    if (value255 <= 10) {
        return value255 / 3294.6
    } else {
        return Math.pow((value255 + 14.025) / 269.025, 2.4);
    }
}

const EPSILON = 216.0 / 24389.0;
const KAPPA = 24389.0 / 27.0;

export function ColorXYZToLAB(xyz: ColorXYZ): ColorLAB {


    const fx = f(xyz[0] / 0.9504492182750991);
    const fy = f(xyz[1]);
    const fz = f(xyz[2] / 1.0889166484304715);

    return [
        116.0 * fy - 16.0,
        500.0 * (fx - fy),
        200.0 * (fy - fz),
    ]
}

function f(v: number): number {
    if (v > EPSILON) {
        return Math.pow(v, 1.0 / 3.0)
    } else {
        return (KAPPA * v + 16.0) / 116.0
    }
}

export function ColorLABToLCH(lab: ColorLAB): ColorLCH {
    return [
        lab[0],
        Math.hypot(lab[1], lab[2]),
        Math.atan2(lab[2], lab[1]) * 360.0 / Math.PI * 2
    ];
}

export function ColorRGBToLCH(x: ColorRGB): ColorLCH {
    return ColorLABToLCH(ColorXYZToLAB(ColorRGBToXYZ(x)));
}

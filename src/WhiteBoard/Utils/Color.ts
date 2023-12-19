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

import Color from './../Constantes/Color.json';

export function CanvasParseColor(x: string): string {
    return Color[x as keyof typeof Color] ?? x;
}

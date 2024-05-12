export function closestToBase(x: number, y: number, base: number) {
    const xd = Math.abs(x - base);
    const yd = Math.abs(y - base);

    return xd < yd ? x : y;
}

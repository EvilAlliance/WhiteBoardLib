export function arrIdentical(a1: Uint32Array, a2: Uint32Array) {
    let i = a1.length;
    if (i != a2.length) return false;
    while (i--) {
        if (a1[i] !== a2[i]) return false;
    }
    return true;
}

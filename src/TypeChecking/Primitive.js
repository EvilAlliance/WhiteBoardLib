export function isNumber(x) {
    return typeof x === 'number';
}

export function isString(x) {
    return typeof x === 'string';
}

export function isBoolean(x) {
    return typeof x === 'boolean';
}

export function isUndefined(x) {
    return typeof x === 'undefined';
}

export function isNull(x) {
    return x === null;
}

export function isSymbol(value) {
    return typeof value === 'symbol';
}

export function isBigInt(value) {
    return typeof value === 'bigint';
}

export function isFunction(value) {
    return typeof value === 'function';
}

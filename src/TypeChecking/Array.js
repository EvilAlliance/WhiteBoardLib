import { isFunction } from "./Primitive";

export function isArray(value) {
    return Array.isArray(value);
}

export function isArrayOf(value, typeCheckFn) {
    if (isArray(value) || isFunction(typeCheckFn)) {
        console.error("First parameter is not an Array, Second parameter is not a Function");
        return false
    }
    return value.every(item => typeCheckFn(item));
}

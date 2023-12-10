import { isArray } from './Array';
import { isFunction } from './Primitive';

export function isObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isObjectWithKeys(value, keys) {
    if (!isObject(value) || !isArray(keys)) {
        console.error('First parameter is not an Object, Second parameter is not an Array');
        return false;
    }
    return keys.every(key => key in value);
}

export function isObjectOf(value, typeCheckFn) {
    if (!isObject(value) || !isFunction(typeCheckFn)) {
        console.error('First parameter is not an Object, Second parameter is not a Function');
        return false;
    }
    return Object.values(value).every(item => typeCheckFn(item));
}

export function isObjectWithKeysAndTypes(value, keyTypeMap) {
    if (!isObject(value) || !isObject(keyTypeMap) || !isObjectOf(keyTypeMap, isFunction)) {
        console.error('First parameter is not an Object, Second parameter is not an Object or Their value is not a Function');
        return false;
    }

    for (const key in keyTypeMap) {
        if (!Object.prototype.hasOwnProperty.call(value, key) || !keyTypeMap[key](value[key])) {
            return false;
        }
    }

    return true;
}

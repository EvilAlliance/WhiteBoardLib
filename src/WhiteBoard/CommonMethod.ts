export function setOption<T extends object>(obj: T, objOption: Partial<T>) {
    for (const key in objOption) {
        obj[key] = objOption[key] as T[typeof key];
    }
}

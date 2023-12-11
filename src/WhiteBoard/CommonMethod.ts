export function setDefault<T extends object>(obj: Partial<T>, objDefault: T) {
    for (const key in objDefault) {
        obj[key] = obj[key] ?? objDefault[key];
    }
}

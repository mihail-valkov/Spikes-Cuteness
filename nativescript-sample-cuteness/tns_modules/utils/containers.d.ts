declare module "utils/containers" {

    interface IEqualityComparer<T> {
        equals(x: T, y: T): boolean;
        getHashCode(obj: T): number;
    }

    class ArraySortHelper {
        public static sort<T>(keys: Array<T>, index: number, length: number, compareFn: (a: T, b: T) => number);
    }

    class Dictionary<TKey, TValue> {
        count: number;
        constructor(comparer: IEqualityComparer<TKey>);
        public forEach(callbackfn: (key: TKey, value: TValue) => void);
        public clear(): void;
        public remove(key: TKey): boolean;
        public get(key: TKey): TValue;
        public has(key: TKey): boolean;
        public set(key: TKey, value: TValue): void;
    }

    class StringComparer implements IEqualityComparer<string> {
        equals(x: string, y: string): boolean;
        getHashCode(str: string): number;
    }
}
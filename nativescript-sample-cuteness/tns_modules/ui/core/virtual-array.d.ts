declare module "ui/core/virtual-array" {
    import observable = require("ui/core/observable");

    export module knownEvents {
        export var itemsLoading: string;
    }

    export class VirtualArray<T> extends observable.Observable {
        constructor(arrayLength?: number);

        length: number;
        loadSize: number;

        /**
         * Returns item at specified index.
         */
        getItem(index: number): T;
        /**
         * Sets item at specified index.
         */
        setItem(index: number, value: T): void;
        /**
         * Loads items from an array starting at index.
         */
        load(index: number, items: T[]): void;

        on(event: string, callback: (data: observable.EventData) => void);
        on(event: "itemsLoading", callback: (args: ItemsLoading) => void);
    }

    export interface ItemsLoading extends observable.EventData {
        index: number;
        count: number;
    }
}
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var observable = require("ui/core/observable");

var CHANGE = "change", UPDATE = "update", DELETE = "delete", ADD = "add";

(function (knownEvents) {
    knownEvents.itemsLoading = "itemsLoading";
})(exports.knownEvents || (exports.knownEvents = {}));
var knownEvents = exports.knownEvents;

var VirtualArray = (function (_super) {
    __extends(VirtualArray, _super);
    function VirtualArray(length) {
        if (typeof length === "undefined") { length = 0; }
        _super.call(this);

        this._length = length;
        this._cache = {};

        this._requestedIndexes = [];
        this._loadedIndexes = [];
    }
    Object.defineProperty(VirtualArray.prototype, "length", {
        get: function () {
            return this._length;
        },
        set: function (value) {
            if (this._length !== value) {
                var index = this._length;
                var count = this._length - value;

                this._length = value;

                this.notify({
                    eventName: CHANGE, object: this,
                    action: count > 0 ? ADD : DELETE,
                    index: index,
                    removed: new Array(count < 0 ? Math.abs(count) : 0),
                    addedCount: count > 0 ? count : 0
                });
            }
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(VirtualArray.prototype, "loadSize", {
        get: function () {
            return this._loadSize;
        },
        set: function (value) {
            this._loadSize = value;
        },
        enumerable: true,
        configurable: true
    });

    VirtualArray.prototype.getItem = function (index) {
        var item = this._cache[index];

        if (index >= 0 && index < this.length && this._requestedIndexes.indexOf(index) < 0 && this._loadedIndexes.indexOf(index) < 0) {
            this.requestItems(index);
        }

        return item;
    };

    VirtualArray.prototype.setItem = function (index, value) {
        if (this._cache[index] !== value) {
            this._cache[index] = value;
        }
    };

    VirtualArray.prototype.load = function (index, items) {
        for (var i = 0; i < items.length; i++) {
            var itemIndex = index + i;

            this._cache[itemIndex] = items[i];

            this._requestedIndexes.splice(this._requestedIndexes.indexOf(itemIndex), 1);

            if (this._loadedIndexes.indexOf(itemIndex) < 0) {
                this._loadedIndexes.push(itemIndex);
            }
        }

        for (var i = 0; i < this.loadSize - items.length; i++) {
            this._requestedIndexes.splice(this._requestedIndexes.indexOf(index + i), 1);
        }

        this.notify({
            eventName: CHANGE, object: this,
            action: UPDATE,
            index: index,
            removed: new Array(items.length),
            addedCount: items.length
        });
    };

    VirtualArray.prototype.requestItems = function (index) {
        var indexesToLoad = [];

        var pageIndex = this._loadSize > 0 ? this._loadSize * Math.floor(index / this._loadSize) : index;

        for (var i = 0; i < this.loadSize; i++) {
            var itemIndex = pageIndex + i;
            if (itemIndex >= this._length) {
                break;
            }

            indexesToLoad.push(itemIndex);

            if (this._requestedIndexes.indexOf(itemIndex) < 0) {
                this._requestedIndexes.push(itemIndex);
            }
        }

        if (indexesToLoad.length > 0) {
            this.notify({
                eventName: knownEvents.itemsLoading, object: this,
                index: indexesToLoad[0],
                count: indexesToLoad.length
            });
        }
    };
    return VirtualArray;
})(observable.Observable);
exports.VirtualArray = VirtualArray;

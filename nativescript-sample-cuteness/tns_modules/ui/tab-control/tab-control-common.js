var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var view = require("ui/core/view");

var OWNER = "ownerId", INDEX = "index";

var TabControl = (function (_super) {
    __extends(TabControl, _super);
    function TabControl() {
        _super.call(this);

        this._synchronizingSelection = false;
        this._items = [];
    }
    Object.defineProperty(TabControl.prototype, "items", {
        get: function () {
            return this._items;
        },
        set: function (value) {
            this._items = value;
            this._onItemsChanged();
        },
        enumerable: true,
        configurable: true
    });

    TabControl.prototype._onItemsChanged = function () {
    };

    Object.defineProperty(TabControl.prototype, "_childrenCount", {
        get: function () {
            if (this._items) {
                return this._items.length;
            }

            return 0;
        },
        enumerable: true,
        configurable: true
    });

    TabControl.prototype._eachChildView = function (callback) {
        var i;
        var length = this._items.length;
        var item;
        var retVal;

        for (i = 0; i < length; i++) {
            item = this._items[i];
            if (item.view) {
                retVal = callback(item.view);
                if (retVal === false) {
                    break;
                }
            }
        }
    };
    return TabControl;
})(view.View);
exports.TabControl = TabControl;

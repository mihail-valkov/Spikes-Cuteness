var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var panelCommon = require("ui/core/panel-common");

var panelNative = require("ui/core/panel-native");

var OWNER = "_owner";

var Panel = (function (_super) {
    __extends(Panel, _super);
    function Panel() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(Panel.prototype, "android", {
        get: function () {
            return this._viewGroup;
        },
        enumerable: true,
        configurable: true
    });

    Panel.prototype._createUI = function () {
        this._viewGroup = new panelNative.Panel(this._context);
        this._viewGroup[OWNER] = this;
    };

    Panel.prototype._onDetached = function (force) {
        delete this._viewGroup[OWNER];

        _super.prototype._onDetached.call(this, force);
    };
    return Panel;
})(panelCommon.Panel);
exports.Panel = Panel;

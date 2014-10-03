var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var panelCommon = require("ui/core/panel-common");

var PanelNative = UIView.extend({
    layoutSubviews: function () {
        this.super.layoutSubviews();
        this.owner.layoutSubviews();
    },
    didMoveToWindow: function () {
        this.super.didMoveToWindow();
        this.owner.didMoveToWindow();
    }
});

var Panel = (function (_super) {
    __extends(Panel, _super);
    function Panel() {
        _super.call(this);

        this._view = new PanelNative();
        this._view["owner"] = this;
        this._view.autoresizesSubviews = false;
    }
    Object.defineProperty(Panel.prototype, "ios", {
        get: function () {
            return this._view;
        },
        enumerable: true,
        configurable: true
    });

    Panel.prototype.layoutSubviews = function () {
        if (this.isLoaded) {
            this._updateLayout();
        }
    };

    Panel.prototype.didMoveToWindow = function () {
        this.onLoaded();
    };
    return Panel;
})(panelCommon.Panel);
exports.Panel = Panel;

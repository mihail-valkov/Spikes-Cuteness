var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var panel = require("ui/core/panel");

var geometry = require("utils/geometry");

(function (Orientation) {
    Orientation[Orientation["Horizontal"] = 0] = "Horizontal";
    Orientation[Orientation["Vertical"] = 1] = "Vertical";
})(exports.Orientation || (exports.Orientation = {}));
var Orientation = exports.Orientation;

var StackPanel = (function (_super) {
    __extends(StackPanel, _super);
    function StackPanel() {
        _super.apply(this, arguments);
        this._orientation = 1 /* Vertical */;
    }
    Object.defineProperty(StackPanel.prototype, "orientation", {
        get: function () {
            return this._orientation;
        },
        set: function (value) {
            if (this._orientation !== value) {
                this._orientation = value;
                this._invalidateMeasure();
            }
        },
        enumerable: true,
        configurable: true
    });

    StackPanel.prototype._measureOverride = function (availableSize) {
        var isHorizontal = this._orientation === 0 /* Horizontal */;
        var desiredSize = new geometry.Size(0, 0);
        var measureSize = isHorizontal ? new geometry.Size(Number.POSITIVE_INFINITY, availableSize.height) : new geometry.Size(availableSize.width, Number.POSITIVE_INFINITY);
        for (var i = 0; i < this.children.length; i++) {
            var child = this.children[i];
            if (child && child.isVisible) {
                var childDesiredSize = child.measure(measureSize);
                if (isHorizontal) {
                    desiredSize.width += childDesiredSize.width;
                    desiredSize.height = Math.max(desiredSize.height, childDesiredSize.height);
                } else {
                    desiredSize.height += childDesiredSize.height;
                    desiredSize.width = Math.max(desiredSize.width, childDesiredSize.width);
                }
            }
        }
        return desiredSize;
    };

    StackPanel.prototype._arrangeOverride = function (finalSize) {
        var isHorizontal = this._orientation === 0 /* Horizontal */;
        var arrangeRect = new geometry.Rect(0, 0, 0, 0);

        for (var i = 0; i < this.children.length; i++) {
            var child = this.children[i];
            if (child && child.isVisible) {
                var childDesiredSize = child._layoutInfo.desiredSize;
                if (isHorizontal) {
                    arrangeRect.width = childDesiredSize.width;
                    arrangeRect.height = Math.max(finalSize.height, childDesiredSize.height);
                    child.arrange(arrangeRect);
                    arrangeRect.x += arrangeRect.width;
                } else {
                    arrangeRect.height = childDesiredSize.height;
                    arrangeRect.width = Math.max(finalSize.width, childDesiredSize.width);
                    child.arrange(arrangeRect);
                    arrangeRect.y += arrangeRect.height;
                }
            }
        }
    };
    return StackPanel;
})(panel.Panel);
exports.StackPanel = StackPanel;

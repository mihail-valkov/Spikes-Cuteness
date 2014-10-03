var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var view = require("ui/core/view");

var geometry = require("utils/geometry");

var application = require("application");
var trace = require("trace");

var Panel = (function (_super) {
    __extends(Panel, _super);
    function Panel() {
        _super.call(this);

        this._children = new Array();
    }
    Object.defineProperty(Panel.prototype, "children", {
        get: function () {
            return this._children;
        },
        enumerable: true,
        configurable: true
    });

    Panel.prototype.getChildById = function (id) {
        return view.getViewById(this, id);
    };

    Panel.prototype.addChild = function (child) {
        this._addView(child);
        this._children.push(child);
    };

    Panel.prototype.removeChild = function (child) {
        this._removeView(child);

        var index = this._children.indexOf(child);
        this._children.splice(index, 1);
    };

    Object.defineProperty(Panel.prototype, "_childrenCount", {
        get: function () {
            return this._children.length;
        },
        enumerable: true,
        configurable: true
    });

    Panel.prototype._eachChildView = function (callback) {
        var i;
        var length = this._children.length;
        var retVal;

        for (i = 0; i < length; i++) {
            retVal = callback(this._children[i]);
            if (retVal === false) {
                break;
            }
        }
    };

    Panel.prototype._addViewToNativeVisualTree = function (child) {
        _super.prototype._addViewToNativeVisualTree.call(this, child);

        if (application.android && this.android && child.android) {
            var viewParent = this.android;
            viewParent.addView(child.android);
            return true;
        } else if (this.ios && this.ios && child.ios) {
            var iOSView = this.ios;
            iOSView.addSubview(child.ios);
            return true;
        }

        return false;
    };

    Panel.prototype._removeViewFromNativeVisualTree = function (child) {
        _super.prototype._removeViewFromNativeVisualTree.call(this, child);

        if (application.android && this.android && child.android) {
            var viewParent = this.android;
            viewParent.removeView(child.android);
            trace.notifyEvent(child, "childInPanelRemovedFromNativeVisualTree");
        } else if (application.ios && this.ios && child.ios) {
            var iOSView = child.ios;
            iOSView.removeFromSuperview();
        }
    };

    Panel.prototype._measureChildren = function (availableSize) {
        return geometry.Size.zero;
    };

    Panel.prototype._arrangeChildren = function (finalSize) {
    };
    return Panel;
})(view.View);
exports.Panel = Panel;

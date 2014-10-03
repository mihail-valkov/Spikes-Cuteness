var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var viewCommon = require("ui/core/view-common");
var geometry = require("utils/geometry");
var layout = require("ui/core/layout");
var trace = require("trace");

require("utils/module-merge").merge(viewCommon, exports);

var NATIVE_VIEW = "_nativeView";

function onIsVisiblePropertyChanged(data) {
    var view = data.object;
    if (!view[NATIVE_VIEW]) {
        return;
    }

    view[NATIVE_VIEW].hidden = !data.newValue;
}

viewCommon.isVisibleProperty.metadata.onSetNativeValue = onIsVisiblePropertyChanged;

var View = (function (_super) {
    __extends(View, _super);
    function View() {
        _super.apply(this, arguments);
    }
    View.prototype._addViewCore = function (view) {
        _super.prototype._addViewCore.call(this, view);
        layout.LayoutInfo.propagateResumeLayout(this._layoutInfo, view._layoutInfo);

        this._invalidateMeasure();
    };

    View.prototype._removeViewCore = function (view) {
        _super.prototype._removeViewCore.call(this, view);
        layout.LayoutInfo.propagateSuspendLayout(view._layoutInfo);

        view._onDetached();

        this._invalidateMeasure();
    };

    View.prototype._measureOverride = function (availableSize) {
        return this._measureNativeView(availableSize);
    };

    View.prototype._measureNativeView = function (availableSize, options) {
        if (this.ios instanceof UIView) {
            var desiredSize = this.ios.sizeThatFits(CGSizeMake(availableSize.width, availableSize.height));
            return new geometry.Size(desiredSize.width, desiredSize.height);
        }

        return geometry.Size.zero;
    };

    View.prototype._setBounds = function (rect) {
        _super.prototype._setBounds.call(this, rect);

        var frame = CGRectMake(rect.x, rect.y, rect.width, rect.height);
        var nativeView = this._nativeView;
        if (nativeView instanceof UIView) {
            trace.write("Native set Frame to View (" + this + "): " + rect, trace.categories.Layout);
            nativeView.frame = frame;
        } else if (nativeView instanceof UIViewController) {
            trace.write("Native set Frame to ViewController (" + this + "): " + rect, trace.categories.Layout);
            nativeView.view.frame = frame;
        }
    };
    View.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);

        this._syncNativeProperties();
    };

    Object.defineProperty(View.prototype, "_nativeView", {
        get: function () {
            return this.ios;
        },
        enumerable: true,
        configurable: true
    });
    return View;
})(viewCommon.View);
exports.View = View;

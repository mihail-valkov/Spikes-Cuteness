var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var viewCommon = require("ui/core/view-common");

var geometry = require("utils/geometry");
var trace = require("trace");
var types = require("utils/types");

require("utils/module-merge").merge(viewCommon, exports);

var ANDROID = "_android";
var NATIVE_VIEW = "_nativeView";

function onIsVisiblePropertyChanged(data) {
    var view = data.object;
    if (!view[NATIVE_VIEW]) {
        return;
    }

    view[NATIVE_VIEW].setVisibility(data.newValue ? android.view.View.VISIBLE : android.view.View.GONE);
}

viewCommon.isVisibleProperty.metadata.onSetNativeValue = onIsVisiblePropertyChanged;

var View = (function (_super) {
    __extends(View, _super);
    function View() {
        _super.apply(this, arguments);
    }
    View.prototype._addViewCore = function (view) {
        if (this._context) {
            view._onAttached(this._context);
        }

        _super.prototype._addViewCore.call(this, view);
    };

    View.prototype._removeViewCore = function (view) {
        _super.prototype._removeViewCore.call(this, view);

        view._onDetached();
    };

    View.prototype._onAttached = function (context) {
        if (!context) {
            throw new Error("Expected valid android.content.Context instance.");
        }

        trace.write("calling _onAttached on view " + this._domId, trace.categories.VisualTreeEvents);

        if (this._context === context) {
            return;
        }

        if (this._context) {
            this._onDetached();
        }

        this._context = context;
        this._onContextChanged();

        trace.notifyEvent(this, "_onAttached");

        if (this._childrenCount > 0) {
            var that = this;
            var eachChild = function (child) {
                child._onAttached(context);
                if (!child._isAddedToNativeVisualTree) {
                    child._isAddedToNativeVisualTree = that._addViewToNativeVisualTree(child);
                }
                return true;
            };
            this._eachChildView(eachChild);
        }
    };

    View.prototype._onDetached = function (force) {
        if (this._childrenCount > 0) {
            var that = this;
            var eachChild = function (child) {
                if (child._isAddedToNativeVisualTree) {
                    that._removeViewFromNativeVisualTree(child);
                }
                child._onDetached(force);
                return true;
            };
            this._eachChildView(eachChild);
        }

        trace.write("calling _onDetached on view " + this._domId, trace.categories.VisualTreeEvents);

        this._clearAndroidReference();

        this._context = undefined;

        trace.notifyEvent(this, "_onDetached");
    };

    View.prototype._clearAndroidReference = function () {
        if (this[NATIVE_VIEW] === this[ANDROID]) {
            this[NATIVE_VIEW] = undefined;
        }

        this[ANDROID] = undefined;
    };

    View.prototype._onContextChanged = function () {
        trace.write("calling _onContextChanged on view " + this._domId, trace.categories.VisualTreeEvents);

        this._createUI();

        this._syncNativeProperties();

        trace.notifyEvent(this, "_onContextChanged");
    };

    View.prototype._setBounds = function (rect) {
        _super.prototype._setBounds.call(this, rect);

        var view = this._nativeView;
        if (view) {
            trace.write("Setting bounds for view with id " + this._domId + "of type " + this.typeName + ": " + rect, trace.categories.Layout);

            var metrics = view.getContext().getResources().getDisplayMetrics();
            var density = metrics.density;

            view.layout(rect.x * density, rect.y * density, (rect.x + rect.width) * density, (rect.y + rect.height) * density);
        }
    };

    View.prototype._getMeasureSpec = function (length, spec) {
        if (types.isDefined(spec)) {
            return android.view.View.MeasureSpec.makeMeasureSpec(length, spec);
        }

        if (isFinite(length)) {
            return android.view.View.MeasureSpec.makeMeasureSpec(length, android.view.View.MeasureSpec.AT_MOST);
        }

        return android.view.View.MeasureSpec.makeMeasureSpec(0, android.view.View.MeasureSpec.UNSPECIFIED);
    };

    View.prototype._measureNativeView = function (availableSize, options) {
        var nativeView = this._nativeView;
        if (nativeView) {
            var metrics = nativeView.getContext().getResources().getDisplayMetrics();

            var measureWidth = availableSize.width * metrics.density;
            var measureHeight = availableSize.height * metrics.density;

            var widthSpec = this._getMeasureSpec(measureWidth, options);
            var heightSpec = this._getMeasureSpec(measureHeight, options);
            nativeView.measure(widthSpec, heightSpec);

            var desiredWidth = Math.round(nativeView.getMeasuredWidth() / metrics.density);
            var desiredHeight = Math.round(nativeView.getMeasuredHeight() / metrics.density);

            return new geometry.Size(desiredWidth, desiredHeight);
        } else {
            return this._measureOverride(availableSize, options);
        }
    };

    Object.defineProperty(View.prototype, "_nativeView", {
        get: function () {
            return this.android;
        },
        enumerable: true,
        configurable: true
    });
    return View;
})(viewCommon.View);
exports.View = View;

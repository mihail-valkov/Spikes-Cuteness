var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/slide-out/slide-out-common");
var view = require("ui/core/view");
var utils = require("utils/utils");
var frame = require("ui/frame");
var geometry = require("utils/geometry");

var SlideOutControl = (function (_super) {
    __extends(SlideOutControl, _super);
    function SlideOutControl() {
        _super.call(this);
        this._optionsCallbackAdded = false;

        var that = this;
        this._optionSelectedCallback = function (data) {
            if (that._android) {
                data.cancel = that._toggle.onOptionsItemSelected(data.item);
            }
        };
    }
    SlideOutControl.prototype._createUI = function () {
        this._android = new android.support.v4.widget.DrawerLayout(this._context);
        this._createToggle();
    };

    Object.defineProperty(SlideOutControl.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });

    SlideOutControl.prototype._addViewToNativeVisualTree = function (child) {
        _super.prototype._addViewToNativeVisualTree.call(this, child);

        if (!this._android) {
            return false;
        }

        this._android.addView(child.android);

        var layoutParams;
        if (child === this.slideContent) {
            layoutParams = new android.support.v4.widget.DrawerLayout.LayoutParams(utils.ad.layout.getDevicePixels(this.slideContentWidth, this._context), android.view.ViewGroup.LayoutParams.MATCH_PARENT, android.view.Gravity.START);
        } else {
            layoutParams = new android.support.v4.widget.DrawerLayout.LayoutParams(android.view.ViewGroup.LayoutParams.MATCH_PARENT, android.view.ViewGroup.LayoutParams.MATCH_PARENT);
        }

        child.android.setLayoutParams(layoutParams);

        if (this.slideContent && this.slideContent._isAddedToNativeVisualTree) {
            this._android.bringChildToFront(this.slideContent.android);
        }

        return true;
    };

    SlideOutControl.prototype._removeViewFromNativeVisualTree = function (child) {
        _super.prototype._removeViewFromNativeVisualTree.call(this, child);

        if (this._android) {
            this._android.removeView(child.android);
        }
    };

    SlideOutControl.prototype._getMeasureSpec = function (length) {
        return android.view.View.MeasureSpec.makeMeasureSpec(length, android.view.View.MeasureSpec.EXACTLY);
    };

    SlideOutControl.prototype._onDetached = function (force) {
        _super.prototype._onDetached.call(this, force);

        if (!this._optionsCallbackAdded) {
            return;
        }

        var owningFrame = view.getAncestor(this, "Frame");
        if (owningFrame) {
            owningFrame.android.removeEventListener(frame.knownEvents.android.optionSelected, this._optionSelectedCallback);
            this._optionsCallbackAdded = false;
        }
    };

    SlideOutControl.prototype._measureOverride = function (availableSize) {
        var baseSize = _super.prototype._measureOverride.call(this, availableSize);

        if (this.slideContent) {
            this.slideContent.measure(new geometry.Size(this.slideContentWidth, availableSize.height), android.view.View.MeasureSpec.EXACTLY);
        }

        if (this.mainContent) {
            this.mainContent.measure(baseSize, android.view.View.MeasureSpec.EXACTLY);
        }

        return baseSize;
    };

    SlideOutControl.prototype._createToggle = function () {
        var opts = this.options;
        if (!opts || !opts.android) {
            return;
        }

        if (!opts.android.closeDescriptionResourceId || !opts.android.openDescriptionResourceId || !opts.android.toggleImageResourceId) {
            return;
        }

        var activity = this._context;
        if (!activity) {
            return;
        }

        var bar = activity.getActionBar();
        if (!bar) {
            return;
        }

        bar.setHomeButtonEnabled(true);
        bar.setDisplayHomeAsUpEnabled(true);

        this._toggle = new android.support.v4.app.ActionBarDrawerToggle(activity, this._android, opts.android.toggleImageResourceId, opts.android.openDescriptionResourceId, opts.android.closeDescriptionResourceId);

        this._android.setDrawerListener(this._toggle);
        this._toggle.syncState();

        var owningFrame = view.getAncestor(this, "Frame");
        if (owningFrame) {
            owningFrame.android.addEventListener(frame.knownEvents.android.optionSelected, this._optionSelectedCallback);
            this._optionsCallbackAdded = true;
        }
    };
    return SlideOutControl;
})(common.SlideOutControl);
exports.SlideOutControl = SlideOutControl;

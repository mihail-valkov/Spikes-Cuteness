var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/slide-out/slide-out-common");

var geometry = require("utils/geometry");
var application = require("application");
var gestures = require("ui/gestures");

var SlideOutControl = (function (_super) {
    __extends(SlideOutControl, _super);
    function SlideOutControl() {
        var _this = this;
        _super.call(this);

        this._ios = new UIView();

        this.observe(gestures.GestureTypes.Swipe, function (args) {
            var swipeArgs = args;
            if (swipeArgs.direction === gestures.SwipeDirection.Left) {
                _this._toggleSlideContentVisibility(false);
            } else if (swipeArgs.direction === gestures.SwipeDirection.Right) {
                _this._toggleSlideContentVisibility(true);
            }
        });
    }
    Object.defineProperty(SlideOutControl.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });

    SlideOutControl.prototype._toggleSlideContentVisibility = function (value) {
        if (this.slideContent && this.slideContent.ios) {
            this.slideContent.ios.hidden = !value;
        }
    };

    SlideOutControl.prototype.openSlideContent = function () {
        this._toggleSlideContentVisibility(true);
    };

    SlideOutControl.prototype.closeSlideContent = function () {
        this._toggleSlideContentVisibility(false);
    };

    SlideOutControl.prototype._measureOverride = function (availableSize) {
        if (this.slideContent) {
            this.slideContent.measure(new geometry.Size(this.slideContentWidth, availableSize.height));
        }

        if (this.mainContent) {
            return this.mainContent.measure(availableSize);
        }

        return geometry.Size.zero;
    };

    SlideOutControl.prototype._addViewToNativeVisualTree = function (view) {
        var _this = this;
        _super.prototype._addViewToNativeVisualTree.call(this, view);

        if (this.ios && view.ios) {
            var iOSView = this.ios;

            if (view === this.slideContent) {
                view.ios.hidden = true;

                view.observe(gestures.GestureTypes.Tap | gestures.GestureTypes.Swipe, function (args) {
                    if (args.type & gestures.GestureTypes.Tap) {
                        _this._toggleSlideContentVisibility(false);
                    }

                    if (args.type & gestures.GestureTypes.Swipe) {
                        var swipeArgs = args;
                        if (swipeArgs.direction === gestures.SwipeDirection.Left) {
                            _this._toggleSlideContentVisibility(false);
                        }
                    }
                });
            }

            iOSView.addSubview(view.ios);
            return true;
        }

        return false;
    };

    SlideOutControl.prototype._removeViewFromNativeVisualTree = function (child) {
        _super.prototype._removeViewFromNativeVisualTree.call(this, child);

        if (application.ios && this.ios && child.ios) {
            var iOSView = child.ios;
            iOSView.removeFromSuperview();
        }
    };
    return SlideOutControl;
})(common.SlideOutControl);
exports.SlideOutControl = SlideOutControl;

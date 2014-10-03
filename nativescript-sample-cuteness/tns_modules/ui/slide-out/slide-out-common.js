var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var view = require("ui/core/view");

var dependencyObservable = require("ui/core/dependency-observable");
var proxy = require("ui/core/proxy");
var geometry = require("utils/geometry");

function onSlideContentWidthPropertyChanged(data) {
    var slideOut = data.object;
    slideOut._onSlideWidthChanged();
}

function onOptionsPropertyChanged(data) {
    var slideOut = data.object;
    slideOut._onOptionsChanged();
}

exports.slideContentWidthProperty = new dependencyObservable.Property("slideContentWidth", "SlideOutControl", new proxy.PropertyMetadata(240, 0 /* None */, onSlideContentWidthPropertyChanged));

exports.optionsProperty = new dependencyObservable.Property("options", "SlideOutControl", new proxy.PropertyMetadata(undefined, 0 /* None */, onOptionsPropertyChanged));

var SlideOutControl = (function (_super) {
    __extends(SlideOutControl, _super);
    function SlideOutControl() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(SlideOutControl.prototype, "options", {
        get: function () {
            return this._getValue(exports.optionsProperty);
        },
        set: function (value) {
            this._setValue(exports.optionsProperty, value);
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(SlideOutControl.prototype, "slideContentWidth", {
        get: function () {
            return this._getValue(exports.slideContentWidthProperty);
        },
        set: function (value) {
            this._setValue(exports.slideContentWidthProperty, value);
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(SlideOutControl.prototype, "slideContent", {
        get: function () {
            return this._slideContent;
        },
        set: function (value) {
            if (this._slideContent === value) {
                return;
            }

            if (this._slideContent) {
                this._detachSlideContent();
            }

            this._slideContent = value;

            if (this._slideContent) {
                this._attachSlideContent();
            }
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(SlideOutControl.prototype, "mainContent", {
        get: function () {
            return this._mainContent;
        },
        set: function (value) {
            if (this._mainContent === value) {
                return;
            }

            if (this._mainContent) {
                this._detachMainContent();
            }

            this._mainContent = value;

            if (this._mainContent) {
                this._attachMainContent();
            }
        },
        enumerable: true,
        configurable: true
    });

    SlideOutControl.prototype.openSlideContent = function () {
    };

    SlideOutControl.prototype.closeSlideContent = function () {
    };

    Object.defineProperty(SlideOutControl.prototype, "_childrenCount", {
        get: function () {
            var count = 0;
            if (this._slideContent) {
                count++;
            }
            if (this._mainContent) {
                count++;
            }

            return count;
        },
        enumerable: true,
        configurable: true
    });

    SlideOutControl.prototype._eachChildView = function (callback) {
        var res;
        if (this._slideContent) {
            res = callback(this._slideContent);
        }
        if (res && this._mainContent) {
            callback(this._mainContent);
        }
    };

    SlideOutControl.prototype._attachSlideContent = function () {
        this._slideContent.width = this.slideContentWidth;
        this._addView(this._slideContent);
    };

    SlideOutControl.prototype._detachSlideContent = function () {
        this._removeView(this._slideContent);
    };

    SlideOutControl.prototype._attachMainContent = function () {
        this._addView(this._mainContent);
    };

    SlideOutControl.prototype._detachMainContent = function () {
        this._removeView(this._mainContent);
    };

    SlideOutControl.prototype._onSlideWidthChanged = function () {
    };

    SlideOutControl.prototype._onOptionsChanged = function () {
    };

    SlideOutControl.prototype._arrangeOverride = function (finalSize) {
        if (this.slideContent) {
            this.slideContent.arrange(new geometry.Rect(0, 0, this.slideContentWidth, finalSize.height));
        }

        if (this.mainContent) {
            this.mainContent.arrange(new geometry.Rect(0, 0, finalSize.width, finalSize.height));
        }
    };
    return SlideOutControl;
})(view.View);
exports.SlideOutControl = SlideOutControl;

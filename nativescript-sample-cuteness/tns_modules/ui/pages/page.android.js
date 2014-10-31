var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var pageCommon = require("ui/pages/page-common");

var trace = require("trace");

var Page = (function (_super) {
    __extends(Page, _super);
    function Page() {
        _super.call(this);

        this._androidPage = new AndroidPage();
    }
    Object.defineProperty(Page.prototype, "android", {
        get: function () {
            return this._androidPage;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Page.prototype, "_nativeView", {
        get: function () {
            return undefined;
        },
        enumerable: true,
        configurable: true
    });

    Page.prototype._onDetached = function (force) {
        if (force || !this.android.cacheOnNavigatedFrom) {
            _super.prototype._onDetached.call(this);
            return;
        } else {
            trace.write("Caching Page " + this._domId, trace.categories.VisualTreeEvents);
        }
    };

    Page.prototype._clearAndroidReference = function () {
    };
    return Page;
})(pageCommon.Page);
exports.Page = Page;

var AndroidPage = (function () {
    function AndroidPage() {
    }
    Object.defineProperty(AndroidPage.prototype, "cacheOnNavigatedFrom", {
        get: function () {
            return this._cacheOnNavigatedFrom;
        },
        set: function (value) {
            this._cacheOnNavigatedFrom = value;
        },
        enumerable: true,
        configurable: true
    });

    return AndroidPage;
})();

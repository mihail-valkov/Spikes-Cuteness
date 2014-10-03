var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var pageCommon = require("ui/pages/page-common");

var trace = require("trace");

var body = {
    get owner() {
        return this._owner;
    },
    viewWillAppear: function (animated) {
        this.super.viewWillAppear(animated);
        trace.write(this.owner + " viewWillAppear", trace.categories.ViewHierarchy);
    },
    viewWillDisappear: function (animated) {
        this.super.viewWillDisappear(animated);
    },
    viewDidAppear: function (animated) {
        this.super.viewDidAppear(animated);

        trace.write(this.owner + " viewDidAppear", trace.categories.ViewHierarchy);
        this.owner.onLoaded();
        this.owner._onContentChanged(this.owner.content, this.owner.content);
    },
    viewDidDisappear: function (animated) {
        this.super.viewDidDisappear(animated);
        this.owner.onUnloaded();
    },
    viewDidLoad: function () {
        this.view.autoresizesSubviews = false;
    },
    viewDidLayoutSubviews: function () {
        trace.write(this.owner + " viewDidLayoutSubviews, isLoaded = " + this.owner.isLoaded, trace.categories.ViewHierarchy);
        this.owner.arrangeView();
    }
};

var viewControllerExtended = UIViewController.extend(body);

var Page = (function (_super) {
    __extends(Page, _super);
    function Page() {
        _super.call(this);
        this._ios = new viewControllerExtended();
        this._ios["_owner"] = this;

        (this._layoutInfo).isLayoutSuspended = false;
    }
    Page.prototype._onContentChanged = function (oldView, newView) {
        _super.prototype._onContentChanged.call(this, oldView, newView);
        if (this.isLoaded) {
            this._removeNativeView(oldView);
            this._addNativeView(newView);
        }
    };

    Page.prototype._addNativeView = function (view) {
        if (this._contentAdded) {
            return;
        }

        var view = this.content;
        if (view) {
            trace.write("Native: Adding " + view + " to " + this, trace.categories.ViewHierarchy);
            if (view.ios instanceof UIView) {
                this._ios.view.addSubview(view.ios);
            } else if (view.ios instanceof UIViewController) {
                this._ios.addChildViewController(view.ios);
                this._ios.view.addSubview(view.ios.view);
            }

            this._contentAdded = true;
        }
    };

    Page.prototype._removeNativeView = function (view) {
        if (!this._contentAdded || !view) {
            return;
        }

        if (view) {
            trace.write("Native: Removing " + view + " from " + this, trace.categories.ViewHierarchy);
            if (view.ios instanceof UIView) {
                view.ios.removeFromSuperview();
            } else if (view.ios instanceof UIViewController) {
                view.ios.removeFromParentViewController();
                view.ios.view.removeFromSuperview();
            }

            this._contentAdded = false;
        }
    };

    Page.prototype.arrangeView = function () {
        if (this.isLoaded) {
            this._updateLayout();
        }
    };

    Object.defineProperty(Page.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Page.prototype, "_nativeView", {
        get: function () {
            return this.ios.view;
        },
        enumerable: true,
        configurable: true
    });
    return Page;
})(pageCommon.Page);
exports.Page = Page;

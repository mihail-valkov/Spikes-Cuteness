var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var view = require("ui/core/view");
var pages = require("ui/pages");
var types = require("utils/types");

var trace = require("trace");

var frameStack = [];

function buildEntryFromArgs(arg) {
    var entry;
    if (types.isString(arg)) {
        entry = {
            moduleName: arg
        };
    } else if (types.isFunction(arg)) {
        entry = {
            create: arg
        };
    } else if (arg instanceof pages.Page) {
        entry = {
            page: arg
        };
    } else {
        entry = arg;
    }

    return entry;
}

function resolvePageFromEntry(entry) {
    var page;

    if (entry.page) {
        page = entry.page;
    } else if (entry.moduleName) {
        page = require(entry.moduleName).Page;
    } else if (entry.create) {
        page = entry.create();
    }

    return page;
}

(function (knownEvents) {
    (function (android) {
        android.optionSelected = "optionSelected";
    })(knownEvents.android || (knownEvents.android = {}));
    var android = knownEvents.android;
})(exports.knownEvents || (exports.knownEvents = {}));
var knownEvents = exports.knownEvents;

var Frame = (function (_super) {
    __extends(Frame, _super);
    function Frame() {
        _super.call(this);
        this._isInFrameStack = false;

        this._backStack = new Array();
        this._isBackNavigation = false;
    }
    Frame.prototype.canGoBack = function () {
        return this._backStack.length > 0;
    };

    Frame.prototype.goBack = function () {
        trace.write(this._getTraceId() + ".goBack();", trace.categories.Navigation);
        if (!this.canGoBack()) {
            return;
        }

        var entry = this._backStack.pop();
        this._isBackNavigation = true;
        this.navigate(entry);
    };

    Frame.prototype.navigate = function (param) {
        trace.write(this._getTraceId() + ".navigate();", trace.categories.Navigation);

        var entry = buildEntryFromArgs(param);
        var newPage = resolvePageFromEntry(entry);

        if (!newPage) {
            throw new Error("Failed to resolve Page instance to navigate to. Processing entry: " + entry);
        }

        this._pushInFrameStack();

        var navigationContext = {
            entry: entry,
            oldPage: this._currentPage,
            newPage: newPage
        };

        this._onNavigatingTo(navigationContext);

        if (this._isBackNavigation) {
            this._goBackCore(entry);
        } else {
            if (this._currentPage) {
                this._backStack.push(this._currentEntry);
            }

            this._navigateCore(navigationContext);
        }

        this._onNavigatedTo(navigationContext);

        this._isBackNavigation = false;
    };

    Frame.prototype._goBackCore = function (entry) {
    };

    Frame.prototype._navigateCore = function (context) {
    };

    Frame.prototype._onNavigatingTo = function (context) {
        if (this._currentPage) {
            this._currentPage.onNavigatingFrom();
            this._removeView(this._currentPage);
        }

        context.newPage.frame = this;
        context.newPage.onNavigatingTo(context.entry.context);
        this._addView(context.newPage);
    };

    Frame.prototype._onNavigatedTo = function (context) {
        if (this._currentPage) {
            this._currentPage.onNavigatedFrom();
            this._currentPage.frame = undefined;
        }

        this._currentPage = context.newPage;
        this._currentEntry = context.entry;

        this._currentPage.onNavigatedTo(context.entry.context);
    };

    Object.defineProperty(Frame.prototype, "backStack", {
        get: function () {
            return this._backStack;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Frame.prototype, "currentPage", {
        get: function () {
            return this._currentPage;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Frame.prototype, "currentEntry", {
        get: function () {
            return this._currentEntry;
        },
        enumerable: true,
        configurable: true
    });

    Frame.prototype._pushInFrameStack = function () {
        if (this._isInFrameStack) {
            return;
        }

        frameStack.push(this);
        this._isInFrameStack = true;
    };

    Frame.prototype._popFromFrameStack = function () {
        if (!this._isInFrameStack) {
            return;
        }

        var top = _topmost();
        if (top !== this) {
            throw new Error("Cannot pop a Frame which is not at the top of the navigation stack.");
        }

        frameStack.pop();
        this._isInFrameStack = false;
    };

    Object.defineProperty(Frame.prototype, "_childrenCount", {
        get: function () {
            if (this._currentPage) {
                return 1;
            }

            return 0;
        },
        enumerable: true,
        configurable: true
    });

    Frame.prototype._eachChildView = function (callback) {
        if (this._currentPage) {
            callback(this._currentPage);
        }
    };

    Frame.prototype._getTraceId = function () {
        return "Frame<" + this._domId + ">";
    };
    return Frame;
})(view.View);
exports.Frame = Frame;

var _topmost = function () {
    if (frameStack.length > 0) {
        return frameStack[frameStack.length - 1];
    }

    return undefined;
};

exports.topmost = _topmost;

function goBack() {
    var top = _topmost();
    if (top.canGoBack()) {
        top.goBack();
        return true;
    }

    while (frameStack.length > 1) {
        top._popFromFrameStack();
        top = _topmost();
        if (top.canGoBack()) {
            top.goBack();
            return true;
            break;
        }
    }

    return false;
}
exports.goBack = goBack;

function stack() {
    return frameStack;
}
exports.stack = stack;

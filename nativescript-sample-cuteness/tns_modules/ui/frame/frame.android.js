var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var frameCommon = require("ui/frame/frame-common");

var geometry = require("utils/geometry");
var trace = require("trace");
var observable = require("ui/core/observable");
var panelNative = require("ui/core/panel-native");

require("utils/module-merge").merge(frameCommon, exports);

var FRAGMENT = "_fragment";
var PAGE = "_page";

var PageFragmentBody = android.app.Fragment.extend({
    onAttach: function (activity) {
        this.super.onAttach(activity);
        trace.write(this.getTag() + ".onAttach();", trace.categories.NativeLifecycle);
    },
    onCreate: function (savedInstanceState) {
        this.super.onCreate(savedInstanceState);
        trace.write(this.getTag() + ".onCreate(); savedInstanceState: " + savedInstanceState, trace.categories.NativeLifecycle);
    },
    onCreateView: function (inflater, container, savedInstanceState) {
        trace.write(this.getTag() + ".onCreateView(); container: " + container + "; savedInstanceState: " + savedInstanceState, trace.categories.NativeLifecycle);

        return this[PAGE].content.android;
    },
    onActivityCreated: function (savedInstanceState) {
        this.super.onActivityCreated(savedInstanceState);
        trace.write(this.getTag() + ".onActivityCreated(); savedInstanceState: " + savedInstanceState, trace.categories.NativeLifecycle);
    },
    onSaveInstanceState: function (outState) {
        this.super.onSaveInstanceState(outState);
        trace.write(this.getTag() + ".onSaveInstanceState();", trace.categories.NativeLifecycle);
    },
    onViewStateRestored: function (savedInstanceState) {
        this.super.onViewStateRestored(savedInstanceState);
        trace.write(this.getTag() + ".onViewStateRestored(); savedInstanceState: " + savedInstanceState, trace.categories.NativeLifecycle);
    },
    onStart: function () {
        this.super.onStart();
        trace.write(this.getTag() + ".onStart();", trace.categories.NativeLifecycle);
    },
    onResume: function () {
        this.super.onResume();
        trace.write(this.getTag() + ".onResume();", trace.categories.NativeLifecycle);
    },
    onPause: function () {
        this.super.onPause();
        trace.write(this.getTag() + ".onPause();", trace.categories.NativeLifecycle);
    },
    onStop: function () {
        this.super.onStop();
        trace.write(this.getTag() + ".onStop();", trace.categories.NativeLifecycle);
    },
    onDestroyView: function () {
        this.super.onDestroyView();
        trace.write(this.getTag() + ".onDestroyView();", trace.categories.NativeLifecycle);
    },
    onDestroy: function () {
        this.super.onDestroy();
        trace.write(this.getTag() + ".onDestroy();", trace.categories.NativeLifecycle);
    },
    onDetach: function () {
        this.super.onDestroy();
        trace.write(this.getTag() + ".onDetach();", trace.categories.NativeLifecycle);
    }
});

var Frame = (function (_super) {
    __extends(Frame, _super);
    function Frame() {
        _super.call(this);
        this._isFirstNavigation = false;

        this._android = new AndroidFrame(this);
    }
    Frame.prototype.onLoaded = function () {
        if (this.currentPage) {
            this.currentPage.onLoaded();
        }

        _super.prototype.onLoaded.call(this);
    };

    Frame.prototype._navigateCore = function (context) {
        var activity = this._android.activity;
        if (!activity) {
            var currentActivity = this._android.currentActivity;
            if (currentActivity) {
                startActivity(currentActivity, context.entry);
            }
            this._delayedEntry = context.entry;
            return;
        }

        var view = context.newPage.content;
        if (!view) {
            throw new Error("No content associated with the Page");
        }

        var manager = activity.getFragmentManager();

        manager.executePendingTransactions();

        var fragmentTransaction = manager.beginTransaction();
        var androidView = view.android;

        var id = androidView.getId();
        if (id < 0) {
            androidView.setId(android.view.View.generateViewId());
        }

        var newFragment = new PageFragmentBody();
        var newFragmentTag = FRAGMENT + this.backStack.length;

        newFragment[PAGE] = context.newPage;

        context.newPage[FRAGMENT] = newFragmentTag;

        var containerViewId = this._android.layout.getId();

        if (this._isFirstNavigation) {
            fragmentTransaction.add(containerViewId, newFragment, newFragmentTag);
            trace.write("fragmentTransaction.add(" + containerViewId + ", " + newFragment + ", " + newFragmentTag + ");", trace.categories.NativeLifecycle);
        } else {
            if (context.oldPage.android.cacheOnNavigatedFrom) {
                var currentFragmentTag = FRAGMENT + 0;
                var backStackEntryCount = manager.getBackStackEntryCount();
                if (backStackEntryCount > 0) {
                    currentFragmentTag = manager.getBackStackEntryAt(backStackEntryCount - 1).getName();
                }

                var currentFragment = manager.findFragmentByTag(currentFragmentTag);
                if (currentFragment) {
                    fragmentTransaction.hide(currentFragment);
                    trace.write("fragmentTransaction.hide(" + currentFragment + ");", trace.categories.NativeLifecycle);
                } else {
                    trace.write("Could not find " + currentFragmentTag + " to hide", trace.categories.NativeLifecycle);
                }

                fragmentTransaction.add(containerViewId, newFragment, newFragmentTag);
                trace.write("fragmentTransaction.add(" + containerViewId + ", " + newFragment + ", " + newFragmentTag + ");", trace.categories.NativeLifecycle);
            } else {
                fragmentTransaction.replace(containerViewId, newFragment, newFragmentTag);
                trace.write("fragmentTransaction.replace(" + containerViewId + ", " + newFragment + ", " + newFragmentTag + ");", trace.categories.NativeLifecycle);
            }

            if (this.backStack.length > 0) {
                fragmentTransaction.addToBackStack(newFragmentTag);
                trace.write("fragmentTransaction.addToBackStack(" + newFragmentTag + ");", trace.categories.NativeLifecycle);
            }
        }

        if (!this._isFirstNavigation) {
            if (context.oldPage.android.cacheOnNavigatedFrom) {
                fragmentTransaction.setTransition(android.app.FragmentTransaction.TRANSIT_NONE);
            } else {
                fragmentTransaction.setTransition(android.app.FragmentTransaction.TRANSIT_FRAGMENT_OPEN);
            }
        }

        fragmentTransaction.commit();
        trace.write("fragmentTransaction.commit();", trace.categories.NativeLifecycle);
    };

    Frame.prototype._goBackCore = function (entry) {
        var manager = this._android.activity.getFragmentManager();

        manager.executePendingTransactions();

        if (manager.getBackStackEntryCount() > 0) {
            manager.popBackStack();
        }
    };

    Frame.prototype._onNavigatingTo = function (context) {
        _super.prototype._onNavigatingTo.call(this, context);

        if (!this._isBackNavigation) {
            return;
        }

        var manager = this._android.activity.getFragmentManager();
        var fragmentName = context.newPage[FRAGMENT];
        var fragment = manager.findFragmentByTag(fragmentName);

        if (!fragment) {
            throw new Error("Must have fragment for each Page.");
        }

        fragment[PAGE] = context.newPage;
    };

    Frame.prototype._onNavigatedTo = function (context) {
        _super.prototype._onNavigatedTo.call(this, context);

        if (!context.oldPage) {
            return;
        }

        var manager = this._android.activity.getFragmentManager();
        var fragmentName = context.oldPage[FRAGMENT];
        var fragment = manager.findFragmentByTag(fragmentName);

        if (!fragment) {
            throw new Error("Must have fragment for each Page.");
        }

        delete fragment[PAGE];
    };

    Object.defineProperty(Frame.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });

    Frame.prototype._createUI = function () {
    };

    Frame.prototype._onActivityCreated = function () {
        this._onAttached(this._android.activity);

        var entry = this._delayedEntry;
        if (!entry) {
            entry = this.currentEntry;
        }

        if (!entry) {
            throw new Error("No NavigationEntry found when starting Activity.");
        }

        this._isFirstNavigation = true;
        this._navigateCore({ entry: entry, oldPage: undefined, newPage: this.currentPage });
        this._isFirstNavigation = false;
        this._delayedEntry = undefined;
    };

    Frame.prototype._popFromFrameStack = function () {
        if (!this._isInFrameStack) {
            return;
        }

        _super.prototype._popFromFrameStack.call(this);
        if (this._android.hasOwnActivity) {
            this._android.activity.finish();
        }
    };

    Frame.prototype._measureOverride = function (availableSize) {
        if (this.currentPage) {
            return this.currentPage.measure(availableSize);
        }

        return geometry.Size.zero;
    };

    Frame.prototype._arrangeOverride = function (finalSize) {
        if (this.currentPage) {
            this.currentPage.arrange(new geometry.Rect(0, 0, finalSize.width, finalSize.height));
        }
    };

    Frame.prototype._setBounds = function (rect) {
    };

    Object.defineProperty(Frame.prototype, "_nativeView", {
        get: function () {
            return this._android.layout;
        },
        enumerable: true,
        configurable: true
    });

    Frame.prototype._clearAndroidReference = function () {
    };
    return Frame;
})(frameCommon.Frame);
exports.Frame = Frame;

var OWNER = "_owner";
var AndroidFrame = (function (_super) {
    __extends(AndroidFrame, _super);
    function AndroidFrame(owner) {
        _super.call(this);
        this.hasOwnActivity = false;
        this.showActionBar = false;
        this._owner = owner;
    }
    Object.defineProperty(AndroidFrame.prototype, "activity", {
        get: function () {
            if (this._activity) {
                return this._activity;
            }

            var currView = this._owner.parent;
            while (currView) {
                if (currView instanceof Frame) {
                    return currView.android.activity;
                }

                currView = currView.parent;
            }

            return undefined;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(AndroidFrame.prototype, "actionBar", {
        get: function () {
            var activity = this.currentActivity;
            if (!activity) {
                return undefined;
            }

            var bar = activity.getActionBar();
            if (!bar) {
                return undefined;
            }

            return bar;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(AndroidFrame.prototype, "currentActivity", {
        get: function () {
            var activity = this.activity;
            if (activity) {
                return activity;
            }

            var stack = frameCommon.stack(), length = stack.length, i = length - 1, frame;

            for (i; i >= 0; i--) {
                frame = stack[i];
                activity = frame.android.activity;
                if (activity) {
                    return activity;
                }
            }

            return undefined;
        },
        enumerable: true,
        configurable: true
    });

    AndroidFrame.prototype.onActivityRequested = function (intent) {
        if (this.activity) {
            throw new Error("Frame already attached to an Activity");
        }
        this.hasOwnActivity = true;
        return this.createActivity(intent);
    };

    AndroidFrame.prototype.canGoBack = function () {
        if (!this._activity) {
            return false;
        }

        return this._activity.getIntent().Action !== android.content.Intent.ACTION_MAIN;
    };

    AndroidFrame.prototype.reset = function () {
        delete this.layout[OWNER];
        this._activity = undefined;
        this.layout = undefined;
    };

    AndroidFrame.prototype.createActivity = function (intent) {
        var that = this, page = this._owner.currentPage;

        if (!page) {
            throw new Error("No Frame.currentPage to create.");
        }

        var body = {
            onCreate: function (savedInstanceState) {
                this.super.onCreate(null);

                trace.write("NativeScriptActivity.onCreate(); savedInstanceState: " + savedInstanceState, trace.categories.NativeLifecycle);

                if (this.hasActionBar) {
                    this.getWindow().requestFeature(android.view.Window.FEATURE_ACTION_BAR);
                }

                that._activity = this;

                var root = new panelNative.Panel(this);
                root[OWNER] = that._owner;
                that.layout = root;
                that.layout.setId(android.view.View.generateViewId());
                this.super.setContentView(that.layout);

                that._owner._onActivityCreated();
            },
            onSaveInstanceState: function (outState) {
                this.super.onSaveInstanceState(outState);
                trace.write("NativeScriptActivity.onSaveInstanceState();", trace.categories.NativeLifecycle);
            },
            onRestoreInstanceState: function (savedInstanceState) {
                this.super.onRestoreInstanceState(savedInstanceState);
                trace.write("NativeScriptActivity.onRestoreInstanceState(); savedInstanceState: " + savedInstanceState, trace.categories.NativeLifecycle);
            },
            onRestart: function () {
                this.super.onRestart();
                trace.write("NativeScriptActivity.onRestart();", trace.categories.NativeLifecycle);
            },
            onStart: function () {
                that._owner.onLoaded();
                this.super.onStart();
                trace.write("NativeScriptActivity.onStart();", trace.categories.NativeLifecycle);
            },
            onResume: function () {
                this.super.onResume();
                trace.write("NativeScriptActivity.onResume();", trace.categories.NativeLifecycle);
            },
            onPause: function () {
                this.super.onPause();
                trace.write("NativeScriptActivity.onPause();", trace.categories.NativeLifecycle);
            },
            onStop: function () {
                this.super.onStop();
                trace.write("NativeScriptActivity.onStop();", trace.categories.NativeLifecycle);
            },
            onDestroy: function () {
                that._owner._onDetached(true);
                that._owner.onUnloaded();
                that.reset();

                this.super.onDestroy();
                trace.write("NativeScriptActivity.onDestroy();", trace.categories.NativeLifecycle);
            },
            onOptionsItemSelected: function (menuItem) {
                if (!that.hasListeners(frameCommon.knownEvents.android.optionSelected)) {
                    return false;
                }

                var data = {
                    cancel: false,
                    eventName: frameCommon.knownEvents.android.optionSelected,
                    item: menuItem,
                    object: that
                };

                that.notify(data);
                return data.cancel;
            },
            onBackPressed: function () {
                trace.write("NativeScriptActivity.onBackPressed;", trace.categories.NativeLifecycle);
                if (!frameCommon.goBack()) {
                    this.super.onBackPressed();
                }
            },
            onLowMemory: function () {
                gc();
                java.lang.System.gc();
                this.super.onLowMemory();
            },
            onTrimMemory: function (level) {
                gc();
                java.lang.System.gc();
                this.super.onTrimMemory(level);
            }
        };

        return com.tns.NativeScriptActivity.extend(body);
    };
    return AndroidFrame;
})(observable.Observable);

function startActivity(activity, entry) {
    var intent = new android.content.Intent(activity, com.tns.NativeScriptActivity.class);
    intent.Action = android.content.Intent.ACTION_DEFAULT;

    activity.startActivity(intent);
}

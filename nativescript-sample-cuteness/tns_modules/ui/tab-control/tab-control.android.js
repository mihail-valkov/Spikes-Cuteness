var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/tab-control/tab-control-common");

var OWNER = "ownerId", INDEX = "index";

var TabControl = (function (_super) {
    __extends(TabControl, _super);
    function TabControl() {
        _super.call(this);
    }
    TabControl.prototype.onLoaded = function () {
        this._updateActionBar();
        _super.prototype.onLoaded.call(this);
    };

    Object.defineProperty(TabControl.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });

    TabControl.prototype.onUnloaded = function () {
        this._clearTabs(undefined);

        _super.prototype.onUnloaded.call(this);
    };

    TabControl.prototype._onItemsChanged = function () {
        if (this.isLoaded) {
            this._updateActionBar();
        }

        _super.prototype._onItemsChanged.call(this);
    };

    TabControl.prototype._createUI = function () {
        this._android = new android.support.v4.view.ViewPager(this._context);
        this._android.setId(android.view.View.generateViewId());

        var that = this;
        var extendsObj = android.support.v4.view.PagerAdapter.extend({
            getCount: function () {
                if (that.items) {
                    return that.items.length;
                }

                return 0;
            },
            getPageTitle: function (index) {
                if (!that.items || index >= that.items.length) {
                    return "";
                }

                return that.items[index].title;
            },
            instantiateItem: function (container, index) {
                if (that.isLoaded) {
                    var item = that.items[index];
                    that._addView(item.view);
                    container.addView(item.view.android);
                }
                return index;
            },
            destroyItem: function (container, index, key) {
                var item = that.items[index];
                that._removeView(item.view);
                container.removeView(item.view.android);
            },
            isViewFromObject: function (view, key) {
                var item = that.items[key];
                return item.view.android === view;
            }
        });

        this._adapter = new extendsObj();
        this._android.setAdapter(this._adapter);

        this._initializeListeners();
        this._android.setOnPageChangeListener(this._pageListener);
    };

    TabControl.prototype._initializeListeners = function () {
        var that = this;

        this._tabListener = new android.app.ActionBar.TabListener({
            onTabSelected: function (tab, transaction) {
                if (that._synchronizingSelection) {
                    return;
                }

                that._synchronizingSelection = true;

                var index = tab.getTag()[INDEX];
                that._android.setCurrentItem(index);
                that._synchronizingSelection = false;
            },
            onTabUnselected: function (tab, transaction) {
                if (that._synchronizingSelection) {
                    return;
                }
            },
            onTabReselected: function (tab, transaction) {
            }
        });

        this._pageListener = new android.support.v4.view.ViewPager.OnPageChangeListener({
            onPageScrollStateChanged: function (state) {
            },
            onPageScrolled: function (index, offset, offsetPixels) {
            },
            onPageSelected: function (index) {
                if (that._synchronizingSelection) {
                    return;
                }

                var actionBar = that._getActionBar();
                if (!actionBar) {
                    return;
                }

                that._synchronizingSelection = true;
                actionBar.setSelectedNavigationItem(index);
                that._synchronizingSelection = false;
            }
        });
    };

    TabControl.prototype._updateActionBar = function () {
        var actionBar = this._getActionBar();
        if (!actionBar) {
            return;
        }

        this._clearTabs(actionBar);
        if (!this.items) {
            return;
        }

        actionBar.setNavigationMode(android.app.ActionBar.NAVIGATION_MODE_TABS);

        var i, length = this.items.length, item, tab, tag;

        for (i = 0; i < length; i++) {
            item = this.items[i];
            tab = actionBar.newTab();
            tab.setText(item.title);

            tag = new java.lang.Object();
            tag[INDEX] = i;

            tag[OWNER] = this._domId;

            tab.setTag(tag);
            tab.setTabListener(this._tabListener);

            actionBar.addTab(tab);
        }

        actionBar.setSelectedNavigationItem(0);
    };

    TabControl.prototype._getActionBar = function () {
        if (!this._android) {
            return undefined;
        }

        var activity = this._android.getContext();
        return activity.getActionBar();
    };

    TabControl.prototype._clearTabs = function (actionBar) {
        if (!actionBar) {
            actionBar = this._getActionBar();
        }

        if (!actionBar) {
            return;
        }

        var i = actionBar.getTabCount() - 1, tab, tag, id = this._domId;

        for (i; i >= 0; i--) {
            tab = actionBar.getTabAt(i);
            tag = tab.getTag();
            if (tag[OWNER] === id) {
                actionBar.removeTabAt(i);
            }
        }

        if (actionBar.getTabCount() === 0) {
            actionBar.setNavigationMode(android.app.ActionBar.NAVIGATION_MODE_STANDARD);
        }
    };
    return TabControl;
})(common.TabControl);
exports.TabControl = TabControl;

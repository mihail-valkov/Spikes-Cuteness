var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var geometry = require("utils/geometry");

var common = require("ui/tab-control/tab-control-common");

var UITabBarControllerDelegateClass = NSObject.extend({ tabBarControllerDidSelectViewController: function (tabBarController, viewController) {
        this["_owner"]._selectedView = this["_owner"].items[tabBarController.selectedIndex].view;
        this["_owner"]._invalidateMeasure();
    } }, {
    name: "UITabBarControllerDelegate",
    protocols: [UITabBarControllerDelegate]
});

var UITabBarControllerClass = UITabBarController.extend({
    viewWillAppear: function (animated) {
        this.super.viewWillAppear(animated);
        this["_owner"]._prepareItems();
        this["_owner"]._selectedView = this["_owner"].items[0].view;
    },
    viewDidAppear: function (animated) {
        this.super.viewDidAppear(animated);
        this["_owner"].onLoaded();
    },
    viewDidLayoutSubviews: function () {
        this["_owner"].arrangeView();
    }
});

var TabControl = (function (_super) {
    __extends(TabControl, _super);
    function TabControl() {
        _super.call(this);
        var that = this;

        this._ios = new UITabBarControllerClass();
        this._ios["_owner"] = this;

        this._delegate = new UITabBarControllerDelegateClass();
        this._delegate["_owner"] = this;
        this._ios.delegate = this._delegate;
    }
    Object.defineProperty(TabControl.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(TabControl.prototype, "_nativeView", {
        get: function () {
            return this._ios.view;
        },
        enumerable: true,
        configurable: true
    });

    TabControl.prototype._prepareItems = function () {
        if (!this.items || this.items.length === 0 || this._preparedItems) {
            return;
        }

        var i, length = this.items.length, controllers = NSMutableArray.alloc().initWithCapacity(length), selectedController, entry, currentController;

        for (i = 0; i < length; i++) {
            entry = this.items[i];

            if (!entry || !entry.view) {
                throw new Error("Invalid TabEntry");
            }

            if (entry.view.ios instanceof UIViewController) {
                currentController = entry.view.ios;
            } else {
                currentController = new UIViewController();
                currentController.view.addSubview(entry.view.ios);
            }

            controllers.addObject(currentController);
            currentController.tabBarItem = UITabBarItem.alloc().initWithTitleImageTag(entry.title, null, -1);
            currentController.tabBarItem.setTitlePositionAdjustment({ horizontal: 0, vertical: -20 });

            this._addView(entry.view);
        }

        this._ios.viewControllers = controllers;
        this._preparedItems = true;
    };

    TabControl.prototype._measureOverride = function (availableSize) {
        var tabBarHeight = this._ios.tabBar.hidden ? 0 : this._ios.tabBar.frame.size.height;
        var selectedViewDesiredSize = this._selectedView.measure(new geometry.Size(availableSize.width, availableSize.height - tabBarHeight));
        return selectedViewDesiredSize;
    };

    TabControl.prototype._arrangeOverride = function (finalSize) {
        var tabBarHeight = this._ios.tabBar.hidden ? 0 : this._ios.tabBar.frame.size.height;
        this._selectedView.arrange(new geometry.Rect(0, 0, finalSize.width, finalSize.height - tabBarHeight));
    };

    TabControl.prototype.arrangeView = function () {
        if (this.isLoaded) {
            this._updateLayout();
        }
    };
    return TabControl;
})(common.TabControl);
exports.TabControl = TabControl;

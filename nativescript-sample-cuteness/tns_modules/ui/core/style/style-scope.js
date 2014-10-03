var visualState = require("ui/core/style/visual-state");
var cssSelector = require("ui/core/style/css-selector");
var VisualState = visualState.VisualState;

var StyleScope = (function () {
    function StyleScope() {
        this._statesByKey = {};
        this._viewIdToKey = {};
    }
    Object.defineProperty(StyleScope.prototype, "css", {
        get: function () {
            return this._css;
        },
        set: function (value) {
            this._css = value;
            this._reset();
        },
        enumerable: true,
        configurable: true
    });

    StyleScope.prototype.assureSelectors = function () {
        if (!this._cssSelectors && this._css) {
            var cssModule = require("utils/css");
            this._createSelectors(cssModule.parse(this._css));
        }
    };

    StyleScope.prototype.applySelectors = function (view) {
        if (!this._cssSelectors) {
            return;
        }

        var i, selector, matchedStateSelectors = new Array();

        for (i = 0; i < this._cssSelectors.length; i++) {
            selector = this._cssSelectors[i];
            if (selector.matches(view)) {
                if (selector instanceof cssSelector.CssVisualStateSelector) {
                    matchedStateSelectors.push(selector);
                } else {
                    selector.apply(view, this);
                }
            }
        }

        if (matchedStateSelectors.length > 0) {
            var key = "";
            matchedStateSelectors.forEach(function (s) {
                return key += s.key + "|";
            });

            this._viewIdToKey[view._domId] = key;

            if (!this._statesByKey[key]) {
                this._createVisualsStatesForSelectors(key, matchedStateSelectors);
            }
        }
    };

    StyleScope.prototype.getVisualStates = function (view) {
        var key = this._viewIdToKey[view._domId];
        if (key === undefined) {
            return undefined;
        }

        return this._statesByKey[key];
    };

    StyleScope.prototype._createVisualsStatesForSelectors = function (key, matchedStateSelectors) {
        var i, allStates = {}, stateSelector;

        this._statesByKey[key] = allStates;

        for (i = 0; i < matchedStateSelectors.length; i++) {
            stateSelector = matchedStateSelectors[i];

            var visualState = allStates[stateSelector.state];
            if (!visualState) {
                visualState = new VisualState();
                allStates[stateSelector.state] = visualState;
            }

            stateSelector.eachSetter(function (property, value) {
                visualState.setters[property.name] = value;
            });
        }
    };

    StyleScope.prototype._createSelectors = function (ast) {
        this._cssSelectors = [];

        var i, j, rules = ast.stylesheet.rules, rule, selector;

        for (i = 0; i < rules.length; i++) {
            rule = rules[i];
            for (j = 0; j < rule.selectors.length; j++) {
                this._cssSelectors.push(cssSelector.createSelector(rule.selectors[j], rule.declarations));
            }
        }

        this._cssSelectors.sort(function (a, b) {
            return a.specificity - b.specificity;
        });
    };

    StyleScope.prototype._reset = function () {
        this._cssSelectors = undefined;
        this._statesByKey = {};
        this._viewIdToKey = {};
    };
    return StyleScope;
})();
exports.StyleScope = StyleScope;

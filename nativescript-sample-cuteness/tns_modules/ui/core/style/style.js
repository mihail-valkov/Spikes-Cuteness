var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var observable = require("ui/core/dependency-observable");
var color = require("color");
var types = require("utils/types");

var trace = require("trace");
var dependencyObservable = require("ui/core/dependency-observable");

var stylers = require("ui/core/style/stylers");

var propertiesByName = {};
var propertiesByCssName = {};
var inheritableProperties = [];

function registerProperty(property) {
    if (propertiesByCssName[property.cssName]) {
        throw new Error("Property with name " + property.cssName + " is already registered!");
    }

    propertiesByCssName[property.cssName] = property;
    propertiesByName[property.name] = property;

    if (property.metadata.inheritable) {
        inheritableProperties.push(property);
    }
}

function getPropertyByName(name) {
    return propertiesByName[name];
}
exports.getPropertyByName = getPropertyByName;

function getPropertyByCssName(name) {
    return propertiesByCssName[name];
}
exports.getPropertyByCssName = getPropertyByCssName;

function eachProperty(callback) {
    types.verifyCallback(callback);

    var i;
    var key;
    var keys = Object.keys(propertiesByName);

    for (i = 0; i < keys.length; i++) {
        key = keys[i];
        callback(propertiesByName[key]);
    }
}
exports.eachProperty = eachProperty;

function eachInheritableProperty(callback) {
    types.verifyCallback(callback);

    var i;
    for (i = 0; i < inheritableProperties.length; i++) {
        callback(inheritableProperties[i]);
    }
}
exports.eachInheritableProperty = eachInheritableProperty;

var Property = (function (_super) {
    __extends(Property, _super);
    function Property(name, cssName, metadata, valueConverter) {
        _super.call(this, name, "Style", metadata);

        this._cssName = cssName;
        this._valueConverter = valueConverter;

        registerProperty(this);
    }
    Object.defineProperty(Property.prototype, "cssName", {
        get: function () {
            return this._cssName;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Property.prototype, "valueConverter", {
        get: function () {
            return this._valueConverter;
        },
        enumerable: true,
        configurable: true
    });

    Property.prototype._getEffectiveValue = function (entry) {
        if (types.isDefined(entry.visualStateValue)) {
            entry.valueSource = 4 /* VisualState */;
            return entry.visualStateValue;
        }

        if (types.isDefined(entry.localValue)) {
            entry.valueSource = 3 /* Local */;
            return entry.localValue;
        }

        if (types.isDefined(entry.cssValue)) {
            entry.valueSource = 2 /* Css */;
            return entry.cssValue;
        }

        if (types.isDefined(entry.inheritedValue)) {
            entry.valueSource = 1 /* Inherited */;
            return entry.inheritedValue;
        }

        entry.valueSource = 0 /* Default */;
        return this.metadata.defaultValue;
    };
    return Property;
})(observable.Property);
exports.Property = Property;

var Style = (function (_super) {
    __extends(Style, _super);
    function Style(parentView) {
        _super.call(this);
        this._view = parentView;
        this._styler = stylers.getStyler(this._view);
    }
    Object.defineProperty(Style.prototype, "color", {
        get: function () {
            return this._getValue(exports.colorProperty);
        },
        set: function (value) {
            this._setValue(exports.colorProperty, value, 3 /* Local */);
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Style.prototype, "backgroundColor", {
        get: function () {
            return this._getValue(exports.backgroundColorProperty);
        },
        set: function (value) {
            this._setValue(exports.backgroundColorProperty, value, 3 /* Local */);
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Style.prototype, "fontSize", {
        get: function () {
            return this._getValue(exports.fontSizeProperty);
        },
        set: function (value) {
            this._setValue(exports.fontSizeProperty, value, 3 /* Local */);
        },
        enumerable: true,
        configurable: true
    });

    Style.prototype._resetCssValues = function () {
        var that = this;
        this._eachSetProperty(function (property) {
            that._resetValue(property, 2 /* Css */);
            return true;
        });
    };

    Style.prototype._onPropertyChanged = function (property, oldValue, newValue) {
        trace.write("Style._onPropertyChanged view:" + this._view + ", property: " + property.name + ", oldValue: " + oldValue + ", newValue: " + newValue, trace.categories.Style);

        _super.prototype._onPropertyChanged.call(this, property, oldValue, newValue);

        this._applyProperty(property, newValue);
    };

    Style.prototype._syncNativeProperties = function () {
        var that = this;

        exports.eachProperty(function (p) {
            var value = that._getValue(p);
            if (types.isDefined(value)) {
                that._applyProperty(p, value);
            }
        });
    };

    Style.prototype._applyProperty = function (property, newValue) {
        this._styler.onPropertyChanged(property, this._view, newValue);

        if (this._view._childrenCount === 0 || !property.metadata.inheritable) {
            return;
        }

        var eachChild = function (child) {
            child.style._inheritStyleProperty(property);
            return true;
        };

        this._view._eachChildView(eachChild);
    };

    Style.prototype._inheritStyleProperty = function (property) {
        if (!property.metadata.inheritable) {
            throw new Error("An attempt was made to inherit a style property which is not marked as 'inheritable'.");
        }

        if (!this._styler.hasHandler(property)) {
            return;
        }

        var currentParent = this._view.parent;
        var valueSource;

        while (currentParent) {
            valueSource = currentParent.style._getValueSource(property);
            if (valueSource > 0 /* Default */) {
                this._setValue(property, currentParent.style._getValue(property), 1 /* Inherited */);
                break;
            }

            currentParent = currentParent.parent;
        }
    };

    Style.prototype._inheritStyleProperties = function () {
        var _this = this;
        exports.eachInheritableProperty(function (p) {
            _this._inheritStyleProperty(p);
        });
    };
    return Style;
})(observable.DependencyObservable);
exports.Style = Style;

function cssColorConverter(cssValue) {
    return new color.Color(cssValue);
}

function cssFontSizeConverter(cssValue) {
    var result = parseFloat(cssValue);
    return result;
}

exports.colorProperty = new Property("color", "color", new observable.PropertyMetadata(undefined, observable.PropertyMetadataOptions.Inheritable), cssColorConverter);

exports.backgroundColorProperty = new Property("backgroundColor", "background-color", new observable.PropertyMetadata(undefined), cssColorConverter);

exports.fontSizeProperty = new Property("fontSize", "font-size", new observable.PropertyMetadata(undefined, 1 /* AffectsMeasure */ | observable.PropertyMetadataOptions.Inheritable), cssFontSizeConverter);

stylers._registerDefaultStylers();

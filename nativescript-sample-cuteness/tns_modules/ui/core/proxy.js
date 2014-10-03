var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var observable = require("ui/core/observable");
var bindable = require("ui/core/bindable");

var dependencyObservable = require("ui/core/dependency-observable");
var types = require("utils/types");

var PropertyMetadata = (function (_super) {
    __extends(PropertyMetadata, _super);
    function PropertyMetadata(defaultValue, options, onChanged, onValidateValue, onSetNativeValue) {
        _super.call(this, defaultValue, options, onChanged, onValidateValue);
        this._onSetNativeValue = onSetNativeValue;
    }
    Object.defineProperty(PropertyMetadata.prototype, "onSetNativeValue", {
        get: function () {
            return this._onSetNativeValue;
        },
        set: function (value) {
            this._onSetNativeValue = value;
        },
        enumerable: true,
        configurable: true
    });
    return PropertyMetadata;
})(dependencyObservable.PropertyMetadata);
exports.PropertyMetadata = PropertyMetadata;

var ProxyObject = (function (_super) {
    __extends(ProxyObject, _super);
    function ProxyObject() {
        _super.apply(this, arguments);
        this._updatingJSProperty = false;
    }
    Object.defineProperty(ProxyObject.prototype, "android", {
        get: function () {
            return undefined;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(ProxyObject.prototype, "ios", {
        get: function () {
            return undefined;
        },
        enumerable: true,
        configurable: true
    });

    ProxyObject.prototype._onPropertyChanged = function (property, oldValue, newValue) {
        _super.prototype._onPropertyChanged.call(this, property, oldValue, newValue);

        this._trySetNativeValue(property, newValue);
    };

    ProxyObject.prototype._onPropertyChangedFromNative = function (property, newValue) {
        this._updatingJSProperty = true;
        this._setValue(property, newValue);
        this._updatingJSProperty = false;
    };

    ProxyObject.prototype._syncNativeProperties = function () {
        var that = this;
        var eachPropertyCallback = function (property) {
            that._trySetNativeValue(property);
            return true;
        };

        this._eachSetProperty(eachPropertyCallback);
    };

    ProxyObject.prototype._trySetNativeValue = function (property, value) {
        if (this._updatingJSProperty) {
            return;
        }

        if (global.android && !this.android) {
            return;
        }

        var metadata = property.metadata;
        if (!(metadata instanceof PropertyMetadata)) {
            return;
        }

        var proxyMetadata = metadata;
        if (proxyMetadata.onSetNativeValue) {
            if (types.isUndefined(value)) {
                value = this._getValue(property);
            }
            proxyMetadata.onSetNativeValue({
                object: this,
                property: property,
                eventName: observable.knownEvents.propertyChange,
                newValue: value,
                oldValue: undefined
            });
        }
    };
    return ProxyObject;
})(bindable.Bindable);
exports.ProxyObject = ProxyObject;

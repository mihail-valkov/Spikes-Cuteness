var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var observable = require("ui/core/observable");
var dependencyObservable = require("ui/core/dependency-observable");

var Bindable = (function (_super) {
    __extends(Bindable, _super);
    function Bindable() {
        _super.apply(this, arguments);
        this._bindings = {};
    }
    Object.defineProperty(Bindable.prototype, "bindingContext", {
        get: function () {
            return this._bindingContext;
        },
        set: function (value) {
            if (this._bindingContext === value) {
                return;
            }

            this._bindingContext = value;
            this._hasLocalContext = !!this._bindingContext;

            this._onBindingContextChanged();
        },
        enumerable: true,
        configurable: true
    });

    Bindable.prototype.bind = function (options, source) {
        var binding = this._bindings[options.targetProperty];
        if (binding) {
            binding.unbind();
        }

        binding = new Binding(this, options);
        this._bindings[options.targetProperty] = binding;

        if (source) {
            binding.bind(source);
        }
    };

    Bindable.prototype.unbind = function (property) {
        var binding = this._bindings[property];
        if (binding) {
            binding.unbind();
            delete this._bindings[property];
        }
    };

    Bindable.prototype.updateTwoWayBinding = function (propertyName, value) {
        var binding = this._bindings[propertyName];

        if (binding) {
            binding.updateTwoWay(value);
        }
    };

    Bindable.prototype.setPropertyCore = function (data) {
        _super.prototype.setPropertyCore.call(this, data);
        this.updateTwoWayBinding(data.propertyName, data.value);
    };

    Bindable.prototype._onPropertyChanged = function (property, oldValue, newValue) {
        _super.prototype._onPropertyChanged.call(this, property, oldValue, newValue);
        this.updateTwoWayBinding(property.name, newValue);
    };

    Bindable.prototype._onBindingContextChanged = function () {
        var binding;
        for (var p in this._bindings) {
            binding = this._bindings[p];
            binding.unbind();
            binding.bind(this._bindingContext);
        }
    };
    return Bindable;
})(dependencyObservable.DependencyObservable);
exports.Bindable = Bindable;

var Binding = (function () {
    function Binding(target, options) {
        this.updating = false;
        this.target = target;
        this.options = options;
    }
    Binding.prototype.bind = function (obj) {
        this.source = obj;
        this.updateTarget(this.getSourceProperty());

        if (this.sourceOptions.instance instanceof observable.Observable) {
            this.sourceOptions.instance.addEventListener(observable.knownEvents.propertyChange, this.onSourcePropertyChanged, this);
        }
    };

    Binding.prototype.unbind = function () {
        if (!this.source || !this.sourceOptions) {
            return;
        }

        if (this.sourceOptions.instance instanceof observable.Observable) {
            this.sourceOptions.instance.removeEventListener(observable.knownEvents.propertyChange, this.onSourcePropertyChanged);
        }
        this.source = undefined;
        this.target = undefined;
        this.sourceOptions = undefined;
        this.targetOptions = undefined;
    };

    Binding.prototype.updateTwoWay = function (value) {
        if (this.options.twoWay) {
            this.updateSource(value);
        }
    };

    Binding.prototype.onSourcePropertyChanged = function (data) {
        if (data.propertyName !== this.options.sourceProperty) {
            return;
        }

        this.updateTarget(data.value);
    };

    Binding.prototype.getSourceProperty = function () {
        if (!this.sourceOptions) {
            this.sourceOptions = this.resolveOptions(this.source, this.options.sourceProperty);
        }

        if (this.sourceOptions.instance instanceof observable.Observable) {
            return this.sourceOptions.instance.getProperty(this.sourceOptions.property);
        }

        return this.sourceOptions.instance[this.sourceOptions.property];
    };

    Binding.prototype.updateTarget = function (value) {
        if (this.updating || !this.target) {
            return;
        }

        if (!this.targetOptions) {
            this.targetOptions = this.resolveOptions(this.target, this.options.targetProperty);
        }

        this.updateOptions(this.targetOptions, value);
    };

    Binding.prototype.updateSource = function (value) {
        if (this.updating || !this.source) {
            return;
        }

        if (!this.sourceOptions) {
            this.sourceOptions = this.resolveOptions(this.source, this.options.sourceProperty);
        }

        this.updateOptions(this.sourceOptions, value);
    };

    Binding.prototype.resolveOptions = function (obj, property) {
        var properties = property.split(".");

        var i, currentObject = obj;
        for (i = 0; i < properties.length - 1; i++) {
            currentObject = currentObject[properties[i]];
        }

        return {
            instance: currentObject,
            property: properties[properties.length - 1]
        };
    };

    Binding.prototype.updateOptions = function (options, value) {
        this.updating = true;
        if (options.instance instanceof observable.Observable) {
            options.instance.setProperty(options.property, value);
        } else {
            options.instance[options.property] = value;
        }
        this.updating = false;
    };
    return Binding;
})();

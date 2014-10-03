var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var observable = require("ui/core/observable");
var types = require("utils/types");

var propertyFromKey = {};
var propertyIdCounter = 0;

function generatePropertyKey(name, ownerType, validate) {
    if (validate) {
        validateRegisterParameters(name, ownerType);
    }
    return ownerType + "." + name;
}

function validateRegisterParameters(name, ownerType) {
    if (name == null || name.trim().length === 0) {
        throw new Error("name should not be null or empty string.");
    }

    if (ownerType == null || ownerType.trim().length === 0) {
        throw new Error("ownerType should not be null or empty string.");
    }
}

function getPropertyByNameAndType(name, ownerType) {
    var key = generatePropertyKey(name, ownerType);
    return propertyFromKey[key];
}

(function (PropertyMetadataOptions) {
    PropertyMetadataOptions[PropertyMetadataOptions["None"] = 0] = "None";
    PropertyMetadataOptions[PropertyMetadataOptions["AffectsMeasure"] = 1] = "AffectsMeasure";
    PropertyMetadataOptions[PropertyMetadataOptions["AffectsArrange"] = 1 << 1] = "AffectsArrange";
    PropertyMetadataOptions[PropertyMetadataOptions["AffectsParentMeasure"] = 1 << 2] = "AffectsParentMeasure";
    PropertyMetadataOptions[PropertyMetadataOptions["AffectsParentArrange"] = 1 << 3] = "AffectsParentArrange";
    PropertyMetadataOptions[PropertyMetadataOptions["Inheritable"] = 1 << 4] = "Inheritable";
})(exports.PropertyMetadataOptions || (exports.PropertyMetadataOptions = {}));
var PropertyMetadataOptions = exports.PropertyMetadataOptions;

(function (ValueSource) {
    ValueSource[ValueSource["Default"] = 0] = "Default";
    ValueSource[ValueSource["Inherited"] = 1] = "Inherited";
    ValueSource[ValueSource["Css"] = 2] = "Css";
    ValueSource[ValueSource["Local"] = 3] = "Local";
    ValueSource[ValueSource["VisualState"] = 4] = "VisualState";
})(exports.ValueSource || (exports.ValueSource = {}));
var ValueSource = exports.ValueSource;

var PropertyMetadata = (function () {
    function PropertyMetadata(defaultValue, options, onChanged, onValidateValue) {
        this._defaultValue = defaultValue;
        this._options = options;
        if (types.isUndefined(this._options)) {
            this._options = 0 /* None */;
        }
        this._onChanged = onChanged;
        this._onValidateValue = onValidateValue;
    }
    Object.defineProperty(PropertyMetadata.prototype, "defaultValue", {
        get: function () {
            return this._defaultValue;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(PropertyMetadata.prototype, "options", {
        get: function () {
            return this._defaultValue;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(PropertyMetadata.prototype, "onValueChanged", {
        get: function () {
            return this._onChanged;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(PropertyMetadata.prototype, "onValidateValue", {
        get: function () {
            return this._onValidateValue;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(PropertyMetadata.prototype, "affectsMeasure", {
        get: function () {
            return (this._options & 1 /* AffectsMeasure */) === 1 /* AffectsMeasure */;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(PropertyMetadata.prototype, "affectsArrange", {
        get: function () {
            return (this._options & PropertyMetadataOptions.AffectsArrange) === PropertyMetadataOptions.AffectsArrange;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(PropertyMetadata.prototype, "affectsParentMeasure", {
        get: function () {
            return (this._options & PropertyMetadataOptions.AffectsParentMeasure) === PropertyMetadataOptions.AffectsParentMeasure;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(PropertyMetadata.prototype, "affectsParentArrange", {
        get: function () {
            return (this._options & PropertyMetadataOptions.AffectsParentArrange) === PropertyMetadataOptions.AffectsParentArrange;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(PropertyMetadata.prototype, "inheritable", {
        get: function () {
            return (this._options & PropertyMetadataOptions.Inheritable) === PropertyMetadataOptions.Inheritable;
        },
        enumerable: true,
        configurable: true
    });
    return PropertyMetadata;
})();
exports.PropertyMetadata = PropertyMetadata;

var Property = (function () {
    function Property(name, ownerType, metadata) {
        this._key = generatePropertyKey(name, ownerType, true);

        if (propertyFromKey[this._key]) {
            throw new Error("Property " + name + " already registered.");
        }
        propertyFromKey[this._key] = this;

        this._name = name;
        this._ownerType = ownerType;

        this._metadata = metadata;
        if (!metadata.options) {
            metadata.options = 0 /* None */;
        }

        this._id = propertyIdCounter++;
    }
    Object.defineProperty(Property.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Property.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Property.prototype, "metadata", {
        get: function () {
            return this._metadata;
        },
        enumerable: true,
        configurable: true
    });

    Property.prototype.isValidValue = function (value) {
        if (this.metadata.onValidateValue) {
            return this.metadata.onValidateValue(value);
        }

        return true;
    };

    Property.prototype._getEffectiveValue = function (entry) {
        if (types.isDefined(entry.localValue)) {
            entry.valueSource = 3 /* Local */;
            return entry.localValue;
        }

        entry.valueSource = 0 /* Default */;
        return this.metadata.defaultValue;
    };
    return Property;
})();
exports.Property = Property;

var PropertyEntry = (function () {
    function PropertyEntry(property) {
        this._property = property;
    }
    Object.defineProperty(PropertyEntry.prototype, "property", {
        get: function () {
            return this._property;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(PropertyEntry.prototype, "effectiveValue", {
        get: function () {
            if (!this._effectiveValue) {
                this._effectiveValue = this._property._getEffectiveValue(this);
            }

            return this._effectiveValue;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(PropertyEntry.prototype, "valueSource", {
        get: function () {
            return this._valueSource;
        },
        set: function (value) {
            this._valueSource = value;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(PropertyEntry.prototype, "localValue", {
        get: function () {
            return this._localValue;
        },
        set: function (value) {
            this._localValue = value;
            this._effectiveValue = undefined;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(PropertyEntry.prototype, "inheritedValue", {
        get: function () {
            return this._inheritedValue;
        },
        set: function (value) {
            this._inheritedValue = value;
            this._effectiveValue = undefined;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(PropertyEntry.prototype, "cssValue", {
        get: function () {
            return this._cssValue;
        },
        set: function (value) {
            this._cssValue = value;
            this._effectiveValue = undefined;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(PropertyEntry.prototype, "visualStateValue", {
        get: function () {
            return this._visualStateValue;
        },
        set: function (value) {
            this._visualStateValue = value;
            this._effectiveValue = undefined;
        },
        enumerable: true,
        configurable: true
    });

    PropertyEntry.prototype.resetValue = function () {
        this._valueSource = 0 /* Default */;
        this._visualStateValue = undefined;
        this._localValue = undefined;
        this._cssValue = undefined;
        this._inheritedValue = undefined;
        this._effectiveValue = undefined;
    };
    return PropertyEntry;
})();
exports.PropertyEntry = PropertyEntry;

var DependencyObservable = (function (_super) {
    __extends(DependencyObservable, _super);
    function DependencyObservable() {
        _super.apply(this, arguments);
        this._propertyEntries = {};
    }
    DependencyObservable.prototype.setProperty = function (name, value) {
        var property = getPropertyByNameAndType(name, this.typeName);
        if (property) {
            this._setValue(property, value, 3 /* Local */);
        } else {
            _super.prototype.setProperty.call(this, name, value);
        }
    };

    DependencyObservable.prototype.getProperty = function (name) {
        var property = getPropertyByNameAndType(name, this.typeName);
        if (property) {
            return this._getValue(property);
        } else {
            return _super.prototype.getProperty.call(this, name);
        }
    };

    DependencyObservable.prototype._setValue = function (property, value, source) {
        if (types.isUndefined(source)) {
            source = 3 /* Local */;
        }

        var entry = this._propertyEntries[property.id];
        if (!entry) {
            entry = new PropertyEntry(property);
            this._propertyEntries[property.id] = entry;
        }

        var currentValue = entry.effectiveValue;

        switch (source) {
            case 2 /* Css */:
                entry.cssValue = value;
                break;
            case 1 /* Inherited */:
                entry.inheritedValue = value;
                break;
            case 3 /* Local */:
                entry.localValue = value;
                break;
            case 4 /* VisualState */:
                entry.visualStateValue = value;
                break;
        }

        if (currentValue !== entry.effectiveValue) {
            this._onPropertyChanged(property, currentValue, entry.effectiveValue);
        }
    };

    DependencyObservable.prototype._getValueSource = function (property) {
        var entry = this._propertyEntries[property.id];
        if (entry) {
            return entry.valueSource;
        }

        return 0 /* Default */;
    };

    DependencyObservable.prototype._getValue = function (property) {
        var entry = this._propertyEntries[property.id];
        if (entry) {
            return entry.effectiveValue;
        }

        return property.metadata.defaultValue;
    };

    DependencyObservable.prototype._resetValue = function (property, source) {
        var entry = this._propertyEntries[property.id];
        if (!entry) {
            return;
        }

        if (types.isDefined(source)) {
            this._setValue(property, undefined, source);
        } else {
            var currentValue = this._getValue(property);
            delete this._propertyEntries[property.id];
            var newValue = this._getValue(property);

            if (currentValue !== newValue) {
                this._onPropertyChanged(property, currentValue, newValue);
            }
        }
    };

    DependencyObservable.prototype._onPropertyChanged = function (property, oldValue, newValue) {
        if (property.metadata.onValueChanged) {
            property.metadata.onValueChanged({
                object: this,
                property: property,
                eventName: observable.knownEvents.propertyChange,
                newValue: newValue,
                oldValue: oldValue
            });
        }

        if (this.hasListeners(observable.knownEvents.propertyChange)) {
            var changeData = _super.prototype.createPropertyChangeData.call(this, property.name, newValue);
            this.notify(changeData);
        }
    };

    DependencyObservable.prototype._eachSetProperty = function (callback) {
        var i;
        var key;
        var entry;
        var retVal;
        var keys = Object.keys(this._propertyEntries);

        for (i = 0; i < keys.length; i++) {
            key = keys[i];
            entry = this._propertyEntries[key];
            retVal = callback(entry.property);
            if (!retVal) {
                break;
            }
        }
    };
    return DependencyObservable;
})(observable.Observable);
exports.DependencyObservable = DependencyObservable;

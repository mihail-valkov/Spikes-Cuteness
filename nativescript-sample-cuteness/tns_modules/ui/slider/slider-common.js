var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var view = require("ui/core/view");

var dependencyObservable = require("ui/core/dependency-observable");
var proxy = require("ui/core/proxy");

exports.valueProperty = new dependencyObservable.Property("value", "Slider", new proxy.PropertyMetadata(0, 0 /* None */));

exports.maxValueProperty = new dependencyObservable.Property("maxValue", "Slider", new proxy.PropertyMetadata(100, 0 /* None */));

var Slider = (function (_super) {
    __extends(Slider, _super);
    function Slider() {
        _super.call(this);

        this.value = 0;
        this.maxValue = 100;
    }
    Object.defineProperty(Slider.prototype, "value", {
        get: function () {
            return this._getValue(exports.valueProperty);
        },
        set: function (value) {
            this._setValue(exports.valueProperty, value);
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Slider.prototype, "maxValue", {
        get: function () {
            return this._getValue(exports.maxValueProperty);
        },
        set: function (value) {
            this._setValue(exports.maxValueProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    return Slider;
})(view.View);
exports.Slider = Slider;

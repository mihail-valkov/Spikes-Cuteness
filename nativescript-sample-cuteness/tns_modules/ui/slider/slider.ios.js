var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/slider/slider-common");

function onValuePropertyChanged(data) {
    var slider = data.object;
    slider.ios.value = data.newValue;
}

function onMaxValuePropertyChanged(data) {
    var slider = data.object;
    slider.ios.maximumValue = data.newValue;
}

common.valueProperty.metadata.onSetNativeValue = onValuePropertyChanged;
common.maxValueProperty.metadata.onSetNativeValue = onMaxValuePropertyChanged;

require("utils/module-merge").merge(common, exports);

var ChangeHandlerClass = NSObject.extend({
    sliderValueChanged: function (sender) {
        this["_owner"]._onPropertyChangedFromNative(common.valueProperty, sender.value);
    }
}, {
    exposedMethods: {
        'sliderValueChanged': 'v@'
    }
});

var Slider = (function (_super) {
    __extends(Slider, _super);
    function Slider() {
        _super.call(this);
        this._ios = new UISlider();

        this._ios.minimumValue = 0;
        this._ios.maximumValue = this.maxValue;

        this._changeHandler = new ChangeHandlerClass();
        this._changeHandler["_owner"] = this;
        this._ios.addTargetActionForControlEvents(this._changeHandler, "sliderValueChanged", 4096 /* UIControlEventValueChanged */);
    }
    Object.defineProperty(Slider.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    return Slider;
})(common.Slider);
exports.Slider = Slider;

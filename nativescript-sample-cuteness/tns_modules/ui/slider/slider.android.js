var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/slider/slider-common");

function onValuePropertyChanged(data) {
    var slider = data.object;
    if (!slider.android) {
        return;
    }

    slider.android.setProgress(data.newValue);
}

function onMaxValuePropertyChanged(data) {
    var slider = data.object;
    if (!slider.android) {
        return;
    }

    slider.android.setMax(data.newValue);
}

common.valueProperty.metadata.onSetNativeValue = onValuePropertyChanged;
common.maxValueProperty.metadata.onSetNativeValue = onMaxValuePropertyChanged;

require("utils/module-merge").merge(common, exports);

var Slider = (function (_super) {
    __extends(Slider, _super);
    function Slider() {
        _super.apply(this, arguments);
    }
    Slider.prototype._createUI = function () {
        var _this = this;
        this._android = new android.widget.SeekBar(this._context);

        this._changeListener = new android.widget.SeekBar.OnSeekBarChangeListener({
            onProgressChanged: function (seekBar, progress, fromUser) {
                _this._onPropertyChangedFromNative(common.valueProperty, seekBar.getProgress());
            },
            onStartTrackingTouch: function (seekBar) {
            },
            onStopTrackingTouch: function (seekBar) {
            }
        });

        this._android.setOnSeekBarChangeListener(this._changeListener);
    };

    Object.defineProperty(Slider.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    return Slider;
})(common.Slider);
exports.Slider = Slider;

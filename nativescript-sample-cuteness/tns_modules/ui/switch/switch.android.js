var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/switch/switch-common");

function onCheckedPropertyChanged(data) {
    var swtch = data.object;
    if (!swtch.android) {
        return;
    }

    swtch.android.setChecked(data.newValue);
}

common.checkedProperty.metadata.onSetNativeValue = onCheckedPropertyChanged;

require("utils/module-merge").merge(common, exports);

var Switch = (function (_super) {
    __extends(Switch, _super);
    function Switch() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(Switch.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });

    Switch.prototype._createUI = function () {
        var _this = this;
        this._android = new android.widget.Switch(this._context);

        this._android.setOnCheckedChangeListener(new android.widget.CompoundButton.OnCheckedChangeListener({
            onCheckedChanged: function (sender, isChecked) {
                _this._onPropertyChangedFromNative(common.checkedProperty, isChecked);
            }
        }));
    };
    return Switch;
})(common.Switch);
exports.Switch = Switch;

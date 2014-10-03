var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/text-field/text-field-common");

function onTextPropertyChanged(data) {
    var textField = data.object;
    if (!textField.android) {
        return;
    }

    textField.android.setText(data.newValue, android.widget.TextView.BufferType.EDITABLE);
}

common.textProperty.metadata.onSetNativeValue = onTextPropertyChanged;

require("utils/module-merge").merge(common, exports);

var TextField = (function (_super) {
    __extends(TextField, _super);
    function TextField() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(TextField.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });

    TextField.prototype._createUI = function () {
        var _this = this;
        this._android = new android.widget.EditText(this._context);

        var textWatcher = new android.text.TextWatcher({
            beforeTextChanged: function (text, start, count, after) {
            },
            onTextChanged: function (text, start, before, count) {
            },
            afterTextChanged: function (editable) {
                _this._onPropertyChangedFromNative(common.textProperty, editable.toString());
            }
        });
        this._android.addTextChangedListener(textWatcher);
    };
    return TextField;
})(common.TextField);
exports.TextField = TextField;

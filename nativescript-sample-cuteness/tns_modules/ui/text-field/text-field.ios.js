var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/text-field/text-field-common");

function onTextPropertyChanged(data) {
    var textField = data.object;
    textField.ios.text = data.newValue;
}

common.textProperty.metadata.onSetNativeValue = onTextPropertyChanged;

require("utils/module-merge").merge(common, exports);

var UITextFieldDelegateClass = NSObject.extend({
    textFieldDidEndEditing: function (field) {
        this["_owner"]._onPropertyChangedFromNative(common.textProperty, field.text);
    }
}, {
    protocols: [UITextFieldDelegate]
});

var TextField = (function (_super) {
    __extends(TextField, _super);
    function TextField() {
        _super.call(this);

        this._ios = new UITextField();

        this._delegate = new UITextFieldDelegateClass();
        this._delegate["_owner"] = this;
        this._ios.delegate = this._delegate;
    }
    Object.defineProperty(TextField.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    return TextField;
})(common.TextField);
exports.TextField = TextField;

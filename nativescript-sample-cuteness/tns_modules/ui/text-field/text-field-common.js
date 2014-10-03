var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var view = require("ui/core/view");

var dependencyObservable = require("ui/core/dependency-observable");
var proxy = require("ui/core/proxy");

exports.textProperty = new dependencyObservable.Property("text", "TextField", new proxy.PropertyMetadata("", 0 /* None */));

var TextField = (function (_super) {
    __extends(TextField, _super);
    function TextField() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(TextField.prototype, "text", {
        get: function () {
            return this._getValue(exports.textProperty);
        },
        set: function (value) {
            this._setValue(exports.textProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    return TextField;
})(view.View);
exports.TextField = TextField;

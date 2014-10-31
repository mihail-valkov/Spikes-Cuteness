var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/switch/switch-common");

function onCheckedPropertyChanged(data) {
    var swtch = data.object;
    swtch.ios.on = data.newValue;
}

common.checkedProperty.metadata.onSetNativeValue = onCheckedPropertyChanged;

require("utils/module-merge").merge(common, exports);

var HandlerClass = NSObject.extend({
    valueChanged: function (sender) {
        this["_owner"]._onPropertyChangedFromNative(common.checkedProperty, sender.on);
    }
}, { exposedMethods: { "valueChanged": "v@" } });

var Switch = (function (_super) {
    __extends(Switch, _super);
    function Switch() {
        _super.call(this);
        this._ios = new UISwitch();

        this._handler = new HandlerClass();
        this._handler["_owner"] = this;
        this._ios.addTargetActionForControlEvents(this._handler, "valueChanged", 4096 /* UIControlEventValueChanged */);
    }
    Object.defineProperty(Switch.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    return Switch;
})(common.Switch);
exports.Switch = Switch;

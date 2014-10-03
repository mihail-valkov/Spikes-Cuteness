var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/button/button-common");

var stateChanged = require("ui/core/control-state-change");
var visualStateConstants = require("ui/core/style/visual-state-constants");

var ClickHandlerClass = NSObject.extend({
    click: function (args) {
        this["_owner"].emit("click");
    }
}, {
    exposedMethods: { "click": "v@" }
});

function onTextPropertyChanged(data) {
    var button = data.object;
    if (!button.ios) {
        return;
    }

    button.ios.setTitleForState(data.newValue, 0 /* UIControlStateNormal */);
}

common.textProperty.metadata.onSetNativeValue = onTextPropertyChanged;

require("utils/module-merge").merge(common, exports);

var Button = (function (_super) {
    __extends(Button, _super);
    function Button() {
        var _this = this;
        _super.call(this);
        this._ios = UIButton.buttonWithType(1 /* UIButtonTypeSystem */);

        this._clickHandler = new ClickHandlerClass();
        this._clickHandler["_owner"] = this;
        this._ios.addTargetActionForControlEvents(this._clickHandler, "click", 64 /* UIControlEventTouchUpInside */);

        this._stateChangedHandler = new stateChanged.ControlStateChangeListener(this._ios, function (s) {
            _this._goToVisualState(s);
        });
    }
    Object.defineProperty(Button.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });

    Button.prototype._controlStateFromVisualState = function () {
        switch (this.visualState) {
            case visualStateConstants.Pressed:
                return 1 /* UIControlStateHighlighted */;
            default:
                return 0 /* UIControlStateNormal */;
        }
    };
    return Button;
})(common.Button);
exports.Button = Button;

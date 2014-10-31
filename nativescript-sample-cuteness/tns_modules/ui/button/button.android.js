var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/button/button-common");

var visualStateConstants = require("ui/core/style/visual-state-constants");

function onTextPropertyChanged(data) {
    var button = data.object;
    if (!button.android) {
        return;
    }

    button.android.setText(data.newValue);
}

common.textProperty.metadata.onSetNativeValue = onTextPropertyChanged;

require("utils/module-merge").merge(common, exports);

var Button = (function (_super) {
    __extends(Button, _super);
    function Button() {
        _super.call(this);

        this._isPressed = false;
    }
    Object.defineProperty(Button.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });

    Button.prototype._createUI = function () {
        var _this = this;
        var that = this;
        var buttonExtends = android.widget.Button.extend({
            drawableStateChanged: function () {
                this.super.drawableStateChanged();
            }
        });
        this._android = new buttonExtends(this._context);

        this._android.setOnClickListener(new android.view.View.OnClickListener({
            onClick: function (v) {
                _this.emit("click");
            }
        }));
    };

    Button.prototype.onDrawableStateChanged = function () {
        if (this._android.isPressed()) {
            this._goToVisualState(visualStateConstants.Pressed);
        } else if (this._android.isHovered()) {
            this._goToVisualState(visualStateConstants.Hovered);
        } else {
            this._goToVisualState(visualStateConstants.Normal);
        }
    };
    return Button;
})(common.Button);
exports.Button = Button;

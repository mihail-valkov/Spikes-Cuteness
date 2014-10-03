var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var types = require("utils/types");

var trace = require("trace");

var style = require("ui/core/style/style");
var constants = require("utils/android_constants");

var stylersCommon = require("ui/core/style/stylers-common");

require("utils/module-merge").merge(stylersCommon, exports);

var DefaultStyler = (function (_super) {
    __extends(DefaultStyler, _super);
    function DefaultStyler() {
        _super.apply(this, arguments);
    }
    DefaultStyler.setBackgroundProperty = function (view, newValue) {
        view.android.setBackgroundColor(newValue);
    };

    DefaultStyler.resetBackgroundProperty = function (view, nativeValue) {
        if (types.isDefined(nativeValue)) {
            view.android.setBackground(nativeValue);
        }
    };

    DefaultStyler.getNativeBackgroundValue = function (view) {
        var drawable = view.android.getBackground();
        if (drawable instanceof android.graphics.drawable.StateListDrawable) {
            trace.write("Native value of view: " + view + " is StateListDrawable. It will not be cached.", trace.categories.Style);
            return undefined;
        }

        return drawable;
    };

    DefaultStyler.prototype.initHandlers = function (handlers) {
        _super.prototype.initHandlers.call(this, handlers);

        handlers[style.backgroundColorProperty.id] = new stylersCommon.StylePropertyChangedHandler(DefaultStyler.setBackgroundProperty, DefaultStyler.resetBackgroundProperty, DefaultStyler.getNativeBackgroundValue);
        ;
    };
    return DefaultStyler;
})(stylersCommon.Styler);
exports.DefaultStyler = DefaultStyler;

var TextViewStyler = (function (_super) {
    __extends(TextViewStyler, _super);
    function TextViewStyler() {
        _super.apply(this, arguments);
    }
    TextViewStyler.setColorProperty = function (view, newValue) {
        view.android.setTextColor(newValue);
    };

    TextViewStyler.resetColorProperty = function (view, nativeValue) {
        view.android.setTextColor(nativeValue);
    };

    TextViewStyler.getNativeColorValue = function (view) {
        return view.android.getTextColors().getDefaultColor();
    };

    TextViewStyler.setFontSizeProperty = function (view, newValue) {
        view.android.setTextSize(newValue);
    };

    TextViewStyler.resetFontSizeProperty = function (view, nativeValue) {
        view.android.setTextSize(android.util.TypedValue.COMPLEX_UNIT_PX, nativeValue);
    };

    TextViewStyler.getNativeFontSizeValue = function (view) {
        return view.android.getTextSize();
    };

    TextViewStyler.prototype.initHandlers = function (handlers) {
        _super.prototype.initHandlers.call(this, handlers);

        handlers[style.colorProperty.id] = new stylersCommon.StylePropertyChangedHandler(TextViewStyler.setColorProperty, TextViewStyler.resetColorProperty, TextViewStyler.getNativeColorValue);
        ;

        handlers[style.fontSizeProperty.id] = new stylersCommon.StylePropertyChangedHandler(TextViewStyler.setFontSizeProperty, TextViewStyler.resetFontSizeProperty, TextViewStyler.getNativeFontSizeValue);
    };
    return TextViewStyler;
})(DefaultStyler);
exports.TextViewStyler = TextViewStyler;

var ButtonStyler = (function (_super) {
    __extends(ButtonStyler, _super);
    function ButtonStyler() {
        _super.apply(this, arguments);
    }
    ButtonStyler.setButtonBackgroundProperty = function (view, newValue) {
        view.android.setBackgroundColor(newValue);
    };

    ButtonStyler.resetButtonBackgroundProperty = function (view, nativeValue) {
        view.android.setBackgroundResource(constants.btn_default);
    };

    ButtonStyler.prototype.initHandlers = function (handlers) {
        _super.prototype.initHandlers.call(this, handlers);

        handlers[style.backgroundColorProperty.id] = new stylersCommon.StylePropertyChangedHandler(ButtonStyler.setButtonBackgroundProperty, ButtonStyler.resetButtonBackgroundProperty);
        ;
    };
    return ButtonStyler;
})(TextViewStyler);
exports.ButtonStyler = ButtonStyler;

function _registerDefaultStylers() {
    stylersCommon.registerStyler("Button", new ButtonStyler());
    stylersCommon.registerStyler("Label", new TextViewStyler());
}
exports._registerDefaultStylers = _registerDefaultStylers;

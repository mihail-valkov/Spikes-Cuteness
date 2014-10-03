var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var style = require("ui/core/style/style");

var stylersCommon = require("ui/core/style/stylers-common");

require("utils/module-merge").merge(stylersCommon, exports);

var DefaultStyler = (function (_super) {
    __extends(DefaultStyler, _super);
    function DefaultStyler() {
        _super.apply(this, arguments);
    }
    DefaultStyler.setBackgroundProperty = function (view, newValue) {
        var nativeView = view._nativeView;
        if (nativeView) {
            nativeView.backgroundColor = newValue;
        }
    };

    DefaultStyler.resetBackgroundProperty = function (view, nativeValue) {
        var nativeView = view._nativeView;
        if (nativeView) {
            nativeView.backgroundColor = nativeValue;
        }
    };

    DefaultStyler.getNativeBackgroundValue = function (view) {
        var nativeView = view._nativeView;
        if (nativeView) {
            return nativeView.backgroundColor;
        }
        return undefined;
    };

    DefaultStyler.prototype.initHandlers = function (handlers) {
        _super.prototype.initHandlers.call(this, handlers);

        handlers[style.backgroundColorProperty.id] = new stylersCommon.StylePropertyChangedHandler(DefaultStyler.setBackgroundProperty, DefaultStyler.resetBackgroundProperty, DefaultStyler.getNativeBackgroundValue);
        ;
    };
    return DefaultStyler;
})(stylersCommon.Styler);
exports.DefaultStyler = DefaultStyler;

var LabelStyler = (function (_super) {
    __extends(LabelStyler, _super);
    function LabelStyler() {
        _super.apply(this, arguments);
    }
    LabelStyler.setColorProperty = function (view, newValue) {
        var label = view._nativeView;
        if (label) {
            label.textColor = newValue;
        }
    };

    LabelStyler.resetColorProperty = function (view, nativeValue) {
        var label = view._nativeView;
        if (label) {
            label.textColor = nativeValue;
        }
    };

    LabelStyler.getNativeColorValue = function (view) {
        var label = view._nativeView;
        if (label) {
            return label.textColor;
        }
    };

    LabelStyler.setFontSizeProperty = function (view, newValue) {
        var label = view._nativeView;
        if (label) {
            label.font = label.font.fontWithSize(newValue);
        }
    };

    LabelStyler.resetFontSizeProperty = function (view, nativeValue) {
        var label = view._nativeView;
        if (label) {
            label.font = label.font.fontWithSize(nativeValue);
        }
    };

    LabelStyler.getNativeFontSizeValue = function (view) {
        var label = view._nativeView;
        if (label) {
            return label.font.pointSize;
        }
    };

    LabelStyler.prototype.initHandlers = function (handlers) {
        _super.prototype.initHandlers.call(this, handlers);

        handlers[style.colorProperty.id] = new stylersCommon.StylePropertyChangedHandler(LabelStyler.setColorProperty, LabelStyler.resetColorProperty, LabelStyler.getNativeColorValue);

        handlers[style.fontSizeProperty.id] = new stylersCommon.StylePropertyChangedHandler(LabelStyler.setFontSizeProperty, LabelStyler.resetFontSizeProperty, LabelStyler.getNativeFontSizeValue);
    };
    return LabelStyler;
})(DefaultStyler);
exports.LabelStyler = LabelStyler;

var ButtonStyler = (function (_super) {
    __extends(ButtonStyler, _super);
    function ButtonStyler() {
        _super.apply(this, arguments);
    }
    ButtonStyler.setColorProperty = function (view, newValue) {
        var btn = view._nativeView;
        if (btn) {
            btn.setTitleColorForState(newValue, 0 /* UIControlStateNormal */);
        }
    };

    ButtonStyler.resetColorProperty = function (view, nativeValue) {
        var btn = view._nativeView;
        if (btn) {
            btn.setTitleColorForState(nativeValue, 0 /* UIControlStateNormal */);
        }
    };

    ButtonStyler.getNativeColorValue = function (view) {
        var btn = view._nativeView;
        if (btn) {
            return btn.titleColorForState(0 /* UIControlStateNormal */);
        }
    };

    ButtonStyler.setFontSizeProperty = function (view, newValue) {
        var btn = view._nativeView;
        if (btn) {
            btn.titleLabel.font = btn.titleLabel.font.fontWithSize(newValue);
        }
    };

    ButtonStyler.resetFontSizeProperty = function (view, nativeValue) {
        var btn = view._nativeView;
        if (btn) {
            btn.font = btn.titleLabel.font.fontWithSize(nativeValue);
        }
    };

    ButtonStyler.getNativeFontSizeValue = function (view) {
        var btn = view._nativeView;
        if (btn) {
            return btn.titleLabel.font.pointSize;
        }
    };

    ButtonStyler.prototype.initHandlers = function (handlers) {
        _super.prototype.initHandlers.call(this, handlers);

        handlers[style.colorProperty.id] = new stylersCommon.StylePropertyChangedHandler(ButtonStyler.setColorProperty, ButtonStyler.resetColorProperty, ButtonStyler.getNativeColorValue);

        handlers[style.fontSizeProperty.id] = new stylersCommon.StylePropertyChangedHandler(ButtonStyler.setFontSizeProperty, ButtonStyler.resetFontSizeProperty, ButtonStyler.getNativeFontSizeValue);
    };
    return ButtonStyler;
})(DefaultStyler);
exports.ButtonStyler = ButtonStyler;

function _registerDefaultStylers() {
    stylersCommon.registerStyler("Button", new ButtonStyler());
    stylersCommon.registerStyler("Label", new LabelStyler());
}
exports._registerDefaultStylers = _registerDefaultStylers;

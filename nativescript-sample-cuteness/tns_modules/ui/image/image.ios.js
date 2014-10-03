var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var imageCommon = require("ui/image/image-common");

require("utils/module-merge").merge(imageCommon, exports);

function onStretchPropertyChanged(data) {
    var image = data.object;

    switch (data.newValue) {
        case imageCommon.stretch.aspectFit:
            image.ios.contentMode = 1 /* UIViewContentModeScaleAspectFit */;
            break;
        case imageCommon.stretch.aspectFill:
            image.ios.contentMode = 2 /* UIViewContentModeScaleAspectFill */;
            break;
        case imageCommon.stretch.fill:
            image.ios.contentMode = 0 /* UIViewContentModeScaleToFill */;
            break;
        case imageCommon.stretch.none:
        default:
            image.ios.contentMode = 9 /* UIViewContentModeTopLeft */;
            break;
    }
}

function onSourcePropertyChanged(data) {
    var image = data.object;
    image.ios.image = data.newValue ? data.newValue.ios : null;
}

imageCommon.stretchProeprty.metadata.onSetNativeValue = onStretchPropertyChanged;
imageCommon.sourceProperty.metadata.onSetNativeValue = onSourcePropertyChanged;

var Image = (function (_super) {
    __extends(Image, _super);
    function Image() {
        _super.call(this);

        this._ios = new UIImageView();
        this._ios.contentMode = 1 /* UIViewContentModeScaleAspectFit */;
        this._ios.clipsToBounds = true;
    }
    Object.defineProperty(Image.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    return Image;
})(imageCommon.Image);
exports.Image = Image;

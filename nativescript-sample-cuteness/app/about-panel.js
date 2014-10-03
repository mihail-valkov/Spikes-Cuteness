var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var stackPanelDef = require("ui/panels/stack-panel");

var imageDef = require("ui/image");
var labelDef = require("ui/label");
var fs = require("file-system");
var imageSource = require("image-source");
var geometry = require("utils/geometry");

var logoPath = fs.path.join(fs.knownFolders.currentApp().path, "app/telerik-logo.png");
var logoImageSource = imageSource.fromFile(logoPath);

var AboutPanel = (function (_super) {
    __extends(AboutPanel, _super);
    function AboutPanel() {
        _super.call(this);

        var image = new imageDef.Image();
        image.margin = new geometry.Thickness(10, 10, 10, 10);
        image.source = logoImageSource;

        this.addChild(image);

        var label = new labelDef.Label();
        label.text = "Cuteness is a proof of concept app demonstrating the Telerik's NativeScript for writing native mobile applications using JavaScript.";
        label.textWrap = true;
        label.margin = new geometry.Thickness(10, 10, 10, 10);

        this.addChild(label);
    }
    return AboutPanel;
})(stackPanelDef.StackPanel);
exports.AboutPanel = AboutPanel;

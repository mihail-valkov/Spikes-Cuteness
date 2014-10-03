var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var pages = require("ui/pages");

var gridPanelDef = require("ui/panels/grid-panel");
var stackPanelDef = require("ui/panels/stack-panel");
var imageDef = require("ui/image");
var labelDef = require("ui/label");

var fs = require("file-system");
var imageSource = require("image-source");
var geometry = require("utils/geometry");

var activityIndicatorDef = require("ui/activity-indicator");
var layout = require("ui/core/layout");

var logoPath = fs.path.join(fs.knownFolders.currentApp().path, "app/reddit-logo-transparent.png");
var defaultImageSource = imageSource.fromFile(logoPath);

var DetailsPage = (function (_super) {
    __extends(DetailsPage, _super);
    function DetailsPage() {
        _super.call(this);

        this._indicator = new activityIndicatorDef.ActivityIndicator();
        this._indicator.width = 50;
        this._indicator.height = 50;
        gridPanelDef.GridPanel.setRow(this._indicator, 0);

        var panel = new gridPanelDef.GridPanel();

        var imageRow = new gridPanelDef.RowDefinition();
        imageRow.height = gridPanelDef.GridLength.auto;

        this._image = new imageDef.Image();
        this._image.stretch = imageDef.stretch.aspectFill;
        this._image.source = defaultImageSource;
        this._image.verticalAlignment = layout.VerticalAlignment.top;
        gridPanelDef.GridPanel.setRow(this._image, 0);

        var textRow = new gridPanelDef.RowDefinition();
        textRow.height = new gridPanelDef.GridLength(1, gridPanelDef.GridUnitType.star);

        var commentsRow = new gridPanelDef.RowDefinition();
        commentsRow.height = new gridPanelDef.GridLength(1, gridPanelDef.GridUnitType.auto);

        panel.addRowDefinition(imageRow);
        panel.addRowDefinition(textRow);
        panel.addRowDefinition(commentsRow);

        this._title = new labelDef.Label();
        this._title.cssClass = "detailsTitle";
        this._title.textWrap = true;
        this._title.margin = new geometry.Thickness(10, 10, 10, 10);

        var detailsTextPanel = new stackPanelDef.StackPanel();
        detailsTextPanel.orientation = 1 /* Vertical */;

        detailsTextPanel.addChild(this._title);

        var authorAndCommentsPanel = new stackPanelDef.StackPanel();
        authorAndCommentsPanel.orientation = 0 /* Horizontal */;
        authorAndCommentsPanel.margin = new geometry.Thickness(10, 10, 10, 10);

        var byLabel = new labelDef.Label();
        byLabel.text = "by";
        byLabel.cssClass = "detailsStaticText";
        byLabel.margin = new geometry.Thickness(2, 2, 2, 2);
        authorAndCommentsPanel.addChild(byLabel);

        this._author = new labelDef.Label();
        this._author.cssClass = "detailsAuthor";
        this._author.margin = new geometry.Thickness(2, 2, 2, 2);
        authorAndCommentsPanel.addChild(this._author);

        var delimiterLabel = new labelDef.Label();
        delimiterLabel.text = "|";
        delimiterLabel.cssClass = "detailsStaticText";
        delimiterLabel.margin = new geometry.Thickness(2, 2, 2, 2);
        authorAndCommentsPanel.addChild(delimiterLabel);

        this._comments = new labelDef.Label();
        this._comments.cssClass = "detailsAuthor";
        this._comments.margin = new geometry.Thickness(2, 2, 2, 2);
        authorAndCommentsPanel.addChild(this._comments);

        gridPanelDef.GridPanel.setRow(detailsTextPanel, 1);

        gridPanelDef.GridPanel.setRow(authorAndCommentsPanel, 2);

        panel.cssClass = "gridpanel";
        panel.addChild(this._image);
        panel.addChild(detailsTextPanel);
        panel.addChild(authorAndCommentsPanel);
        panel.addChild(this._indicator);

        this.content = panel;
        global.loadCss(this);
    }
    DetailsPage.prototype.onNavigatedTo = function (context) {
        _super.prototype.onNavigatedTo.call(this, context);

        var item = context;
        if (item) {
            this._title.text = item.data.title;
            this._author.text = item.data.author;
            this._comments.text = item.data.num_comments + " comments";

            this._indicator.bind({
                sourceProperty: "isLoading",
                targetProperty: "busy"
            }, this._image);

            if (item.data.url.indexOf(".png") !== -1 || item.data.url.indexOf(".jpg") !== -1) {
                this._image.url = item.data.url;
            }
        }
    };
    return DetailsPage;
})(pages.Page);
exports.DetailsPage = DetailsPage;

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var gridPanelDef = require("ui/panels/grid-panel");
var imageDef = require("ui/image");
var observable = require("ui/core/observable");
var labelDef = require("ui/label");
var fs = require("file-system");
var imageSource = require("image-source");
var geometry = require("utils/geometry");

var layout = require("ui/core/layout");

var appPath = fs.knownFolders.currentApp().path;

var logoPath = fs.path.join(appPath, "app/reddit-logo.png");
var defaultImageSource = imageSource.fromFile(logoPath);

var brokenImagePath = fs.path.join(appPath, "app/no-image.png");
var brokenImageSource = imageSource.fromFile(brokenImagePath);

var firstImagePath = fs.path.join(appPath, "app/first-image.png");
var firstImageSource = imageSource.fromFile(firstImagePath);

var imageCache = {};

var ListViewItem = (function (_super) {
    __extends(ListViewItem, _super);
    function ListViewItem(listView) {
        var _this = this;
        _super.call(this);

        this._listView = listView;

        var columnDefinition = new gridPanelDef.ColumnDefinition();
        columnDefinition.width = new gridPanelDef.GridLength(80, gridPanelDef.GridUnitType.pixel);
        this.addColumnDefinition(columnDefinition);

        var secondColumnDefinition = new gridPanelDef.ColumnDefinition();
        secondColumnDefinition.width = new gridPanelDef.GridLength(1, gridPanelDef.GridUnitType.star);
        this.addColumnDefinition(secondColumnDefinition);

        var thirdColumnDefinition = new gridPanelDef.ColumnDefinition();
        thirdColumnDefinition.width = gridPanelDef.GridLength.auto;
        this.addColumnDefinition(thirdColumnDefinition);

        var firstRowDefinition = new gridPanelDef.RowDefinition();
        firstRowDefinition.minHeight = 50;
        this.addRowDefinition(firstRowDefinition);

        var secondRowDefinition = new gridPanelDef.RowDefinition();
        secondRowDefinition.height = new gridPanelDef.GridLength(25, gridPanelDef.GridUnitType.pixel);
        this.addRowDefinition(secondRowDefinition);

        this._image = new imageDef.Image();
        this._image.source = defaultImageSource;
        this._image.on(observable.knownEvents.propertyChange, function (args) {
            if (args.propertyName === "source") {
                if (_this._item && (_this._image.source !== defaultImageSource && ListViewItem.isValidImage(_this._item.data.thumbnail))) {
                    imageCache[_this._item.data.thumbnail] = _this._image.source;
                }
            }
        });
        this._image.width = 72;
        this._image.height = 72;
        this._image.margin = new geometry.Thickness(3, 3, 3, 3);
        this._image.verticalAlignment = layout.VerticalAlignment.top;
        gridPanelDef.GridPanel.setRowSpan(this._image, 2);
        this.addChild(this._image);

        this._titleLabel = new labelDef.Label();
        this._titleLabel.textWrap = true;
        this._titleLabel.cssClass = "title";
        this._titleLabel.margin = new geometry.Thickness(3, 3, 3, 3);
        gridPanelDef.GridPanel.setColumn(this._titleLabel, 1);
        gridPanelDef.GridPanel.setColumnSpan(this._titleLabel, 2);
        this.addChild(this._titleLabel);

        this._authorLabel = new labelDef.Label();
        this._authorLabel.cssClass = "author";
        this._authorLabel.margin = new geometry.Thickness(3, 3, 3, 3);
        this._authorLabel.width = 150;
        this._authorLabel.horizontalAlignment = layout.HorizontalAlignment.left;
        this._authorLabel.verticalAlignment = layout.VerticalAlignment.bottom;
        gridPanelDef.GridPanel.setRow(this._authorLabel, 1);
        gridPanelDef.GridPanel.setColumn(this._authorLabel, 1);
        this.addChild(this._authorLabel);

        this._commentsLabel = new labelDef.Label();
        this._commentsLabel.margin = new geometry.Thickness(3, 3, 3, 3);
        this._commentsLabel.cssClass = "comments";
        this._commentsLabel.verticalAlignment = layout.VerticalAlignment.bottom;
        gridPanelDef.GridPanel.setRow(this._commentsLabel, 1);
        gridPanelDef.GridPanel.setColumn(this._commentsLabel, 2);
        this.addChild(this._commentsLabel);
    }
    Object.defineProperty(ListViewItem.prototype, "item", {
        get: function () {
            return this._item;
        },
        set: function (value) {
            this._item = value;
            this._update();
        },
        enumerable: true,
        configurable: true
    });

    ListViewItem.prototype._update = function () {
        if (!this._item || (this._item && this._titleLabel.text === this._item.data.title && this._image.source !== defaultImageSource)) {
            return;
        }

        this._titleLabel.text = this._item.data.title;
        this._authorLabel.text = "by " + this._item.data.author;
        this._commentsLabel.text = this._item.data.num_comments + " comments";

        if (this._titleLabel.text === "reddit 101") {
            this._image.source = firstImageSource;
            return;
        }

        var source = imageCache[this._item.data.thumbnail];

        if (source) {
            this._image.source = source;
        } else {
            this._image.source = defaultImageSource;

            if (!this._listView.isScrolling) {
                if (ListViewItem.isValidImage(this._item.data.thumbnail)) {
                    this._image.url = this._item.data.thumbnail;
                } else {
                    this._image.source = brokenImageSource;
                }
            }
        }
    };

    ListViewItem.isValidImage = function (url) {
        return url.indexOf(".png") !== -1 || url.indexOf(".jpg") !== -1;
    };
    return ListViewItem;
})(gridPanelDef.GridPanel);
exports.ListViewItem = ListViewItem;

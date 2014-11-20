var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var imageSource = require("image-source");
var fs = require("file-system");
var builder = require("ui/builder");
var contentView = require("ui/content-view");
var view = require("ui/core/view");
var firstImageSource = imageSource.fromFile(__dirname + "/first-image.png");
var cache = global.imageCache;
var ListViewItem = (function (_super) {
    __extends(ListViewItem, _super);
    function ListViewItem(listView) {
        _super.call(this);
        this._listView = listView;
        var fileName = fs.path.join(__dirname, "list-view-item.xml");
        if (fs.File.exists(fileName)) {
            this.content = builder.load(fileName, module.exports);
            this._image = view.getViewById(this.content, "itemImage");
            this._image.source = cache.placeholder;
            this._titleLabel = view.getViewById(this.content, "titleLabel");
            this._authorLabel = view.getViewById(this.content, "authorLabel");
            this._commentsLabel = view.getViewById(this.content, "commentsLabel");
        }
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
        if (!this._item) {
            this._reset();
            return;
        }
        this._titleLabel.text = this._item.data.title;
        this._authorLabel.text = "by " + this._item.data.author;
        this._commentsLabel.text = this._item.data.num_comments + " comments";
        if (this._item.data.title === "reddit 101") {
            this._image.source = firstImageSource;
            return;
        }
        var source = cache.get(this._item.data.thumbnail);
        if (source) {
            this._image.source = source;
        }
        else {
            this._image.source = cache.placeholder;
            this._requestImageDownload();
        }
    };
    ListViewItem.prototype._reset = function () {
        this._image.source = cache.placeholder;
        this._titleLabel.text = "Downloading...";
        this._authorLabel.text = "";
        this._commentsLabel.text = "";
    };
    ListViewItem.prototype._requestImageDownload = function () {
        if (this._listView.isScrolling) {
            return;
        }
        var that = this;
        var completed = function (result, key) {
            if (!that._listView.isScrolling && that._item && that._item.data.thumbnail === key) {
                that._image.source = result;
            }
        };
        var request = {
            completed: completed,
            key: this._item.data.thumbnail,
            url: this._item.data.thumbnail
        };
        cache.push(request);
    };
    return ListViewItem;
})(contentView.ContentView);
exports.ListViewItem = ListViewItem;

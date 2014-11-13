var view = require("ui/core/view");
var imageSource = require("image-source");
var frames = require("ui/frame");
var listView = require("ui/list-view");
var listItem = require("/list-view-item");
var model = require("/view-model");
var cache = global.imageCache;
var defaultOnChanged = listView.isScrollingProperty.metadata.onValueChanged;
listView.isScrollingProperty.metadata.onValueChanged = handleIsScrollingChanged;
function handleIsScrollingChanged(data) {
    if (defaultOnChanged) {
        defaultOnChanged(data);
    }
    if (data.newValue) {
        cache.disableDownload();
    }
    else {
        cache.enableDownload();
    }
}
function pageLoaded(args) {
    var page = args.object;
    if (frames.topmost().android) {
        frames.topmost().android.cachePagesOnNavigate = true;
    }
    global.loadCss(page);
    var feedListView = view.getViewById(page, "feedListView");
    if (feedListView) {
        feedListView.items = model.items;
    }
    var aboutImage = view.getViewById(page, "aboutImage");
    if (aboutImage) {
        aboutImage.source = imageSource.fromFile(__dirname + "/telerik-logo.png");
    }
}
exports.pageLoaded = pageLoaded;
function listViewItemLoading(args) {
    var listView = args.object;
    var listViewItem = args.view;
    if (!listViewItem) {
        listViewItem = new listItem.ListViewItem(listView);
        args.view = listViewItem;
    }
    listViewItem.item = model.items.getItem(args.index);
}
exports.listViewItemLoading = listViewItemLoading;
function listViewItemTap(args) {
    frames.topmost().navigate({
        moduleName: "/details-page",
        context: model.items.getItem(args.index)
    });
}
exports.listViewItemTap = listViewItemTap;
function listViewLoadMoreItems(args) {
    model.items.length += model.items.loadSize;
}
exports.listViewLoadMoreItems = listViewLoadMoreItems;

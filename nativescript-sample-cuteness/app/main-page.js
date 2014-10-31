var http = require("http");

var pages = require("ui/pages");
var listViewDef = require("ui/list-view");
var tabDef = require("ui/tab-control");
var virtualArrayDef = require("ui/core/virtual-array");

var listViewItemDef = require("/list-view-item");
var detailsPageDef = require("/details-page");

var aboutPanelDef = require("/about-panel");

var redditUrl = "http://www.reddit.com/r/aww.json?limit=";
var after;

var items = new virtualArrayDef.VirtualArray(1000);
items.loadSize = 50;
items.on(virtualArrayDef.knownEvents.itemsLoading, function (args) {
    http.getJSON(redditUrl + args.count + (after ? "&after=" + after : "")).then(function (result) {
        var itemsToLoad = result.data.children;

        items.load(args.index, itemsToLoad);

        var lastItem = itemsToLoad[itemsToLoad.length - 1];
        if (lastItem) {
            after = itemsToLoad[itemsToLoad.length - 1].data.name;
        }
    }).fail(function (e) {
        console.log(e.message);
    });
    ;
});

var listView = new listViewDef.ListView();

listView.on(listViewDef.knownEvents.itemLoading, function (args) {
    var listViewItem = args.view;
    if (!listViewItem) {
        listViewItem = new listViewItemDef.ListViewItem(listView);
        args.view = listViewItem;
    }

    listViewItem.item = items.getItem(args.index);
});

listView.on(listViewDef.knownEvents.loadMoreItems, function (args) {
    items.length += items.loadSize;
});

listView.on(listViewDef.knownEvents.itemTap, function (args) {
    var detailsPage = new detailsPageDef.DetailsPage();
    page.frame.navigate({
        page: detailsPage,
        context: items.getItem(args.index)
    });
});

listView.items = items;

var page = new pages.Page();

if (page.android) {
    page.android.cacheOnNavigatedFrom = true;
}

var tabControl = new tabDef.TabControl();
tabControl.items = [{ title: "List", view: listView }, { title: "About", view: new aboutPanelDef.AboutPanel() }];

page.content = tabControl;

global.loadCss(page);

exports.Page = page;

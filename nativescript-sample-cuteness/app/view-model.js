var virtualArrayDef = require("data/virtual-array");
var http = require("http");
var redditUrl = "http://www.reddit.com/r/aww.json?limit=";
var after;
exports.items = new virtualArrayDef.VirtualArray(1000);
exports.items.loadSize = 50;
exports.items.on(virtualArrayDef.knownEvents.itemsLoading, function (args) {
    http.getJSON(redditUrl + args.count + (after ? "&after=" + after : "")).then(function (result) {
        var itemsToLoad = result.data.children;
        exports.items.load(args.index, itemsToLoad);
        var lastItem = itemsToLoad[itemsToLoad.length - 1];
        if (lastItem) {
            after = itemsToLoad[itemsToLoad.length - 1].data.name;
        }
    }, function (e) {
        console.log(e.message);
    });
});

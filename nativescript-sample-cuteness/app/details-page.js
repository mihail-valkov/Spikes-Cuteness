var imageSource = require("image-source");
var view = require("ui/core/view");
var defaultImageSource = imageSource.fromFile(__dirname + "/reddit-logo-transparent.png");
function pageNavigatedTo(args) {
    var page = args.object;
    var item = page.navigationContext;
    global.loadCss(page);
    var image = view.getViewById(page, "image");
    image.source = defaultImageSource;
    var title = view.getViewById(page, "titleLabel");
    var author = view.getViewById(page, "authorLabel");
    var comments = view.getViewById(page, "commentsLabel");
    var indicator = view.getViewById(page, "indicator");
    if (item) {
        title.text = item.data.title;
        author.text = item.data.author;
        comments.text = item.data.num_comments + " comments";
        indicator.bind({
            sourceProperty: "isLoading",
            targetProperty: "busy"
        }, image);
        if (item.data.url.indexOf(".png") !== -1 || item.data.url.indexOf(".jpg") !== -1) {
            image.url = item.data.url;
        }
    }
}
exports.pageNavigatedTo = pageNavigatedTo;

var application = require("application");
var imageCache = require("ui/image-cache");
var imageSource = require("image-source");
var file_access_module = require("file-system/file-system-access");
application.mainModule = "/main-page";
global.loadCss = function (page) {
    var fileAccess = new file_access_module.FileSystemAccess();
    fileAccess.readText(__dirname + "/style.css", function (css) {
        page.css = css;
    });
};
var cache = new imageCache.Cache();
cache.invalid = imageSource.fromFile(__dirname + "/no-image.png");
cache.placeholder = imageSource.fromFile(__dirname + "/reddit-logo.png");
cache.maxRequests = 5;
global.imageCache = cache;
application.start();

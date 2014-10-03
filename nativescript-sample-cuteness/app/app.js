var application = require("application");
var fs = require("file-system");

application.mainModule = "/main-page";

global.loadCss = function (page) {
    var cssPath = fs.path.join(fs.knownFolders.currentApp().path, "app/style.css");
    fs.File.fromPath(cssPath).readText().then(function (css) {
        page.css = css;
    });
};

application.start();

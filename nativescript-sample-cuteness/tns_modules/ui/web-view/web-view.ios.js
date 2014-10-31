var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var view = require("ui/core/view");
var fs = require("file-system");

var URL = "url";

var FRAME_LOAD_START = "loadStart";
var FRAME_LOAD_FINISH = "loadFinish";
var LOAD_ERROR = "loadError";
var SHOULD_LOAD = "shouldStartLoad";

var UIWebViewDelegateClass = NSObject.extend({
    webViewShouldStartLoadWithRequestNavigationType: function (webView, request, navigationType) {
        var data = { eventName: SHOULD_LOAD, object: this["_owner"], cancel: false, url: request.URL.absoluteString };
        this["_owner"].notify(data);

        return !(data.cancel);
    },
    webViewDidStartLoad: function (webView) {
        this["_owner"].emit(FRAME_LOAD_START);
    },
    webViewDidFinishLoad: function (webView) {
        this["_owner"].emit(FRAME_LOAD_FINISH);
    },
    webViewDidFailLoadWithError: function (webView, error) {
        this["_owner"].notify({ eventName: LOAD_ERROR, object: this["_owner"], error: error.localizedDescription });
    }
}, {
    protocols: [UIWebViewDelegate]
});

var WebView = (function (_super) {
    __extends(WebView, _super);
    function WebView() {
        _super.call(this);
        this._ios = new UIWebView();

        this._delegate = new UIWebViewDelegateClass();
        this._delegate["_owner"] = this;
        this._ios.delegate = this._delegate;
    }
    Object.defineProperty(WebView.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(WebView.prototype, "url", {
        get: function () {
            return this._url;
        },
        set: function (value) {
            this.setProperty(URL, value);
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(WebView.prototype, "canGoBack", {
        get: function () {
            return this._ios.canGoBack;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(WebView.prototype, "canGoForward", {
        get: function () {
            return this._ios.canGoForward;
        },
        enumerable: true,
        configurable: true
    });

    WebView.prototype.goBack = function () {
        this._ios.goBack();
    };

    WebView.prototype.goForward = function () {
        this._ios.goForward();
    };

    WebView.prototype.loadData = function (data, baseURL, mimeType, encoding) {
        if (!baseURL) {
            baseURL = "file://" + fs.knownFolders.documents();
        }
        if (!mimeType) {
            mimeType = "text/html";
        }
        if (!encoding) {
            encoding = "utf-8";
        }
        this._ios.loadDataMIMETypeTextEncodingNameBaseURL(NSString.alloc().initWithString(data).dataUsingEncoding(4), mimeType, encoding, NSURL.URLWithString(baseURL));
    };

    WebView.prototype.setNativeProperty = function (name, value) {
        if (name === URL) {
            this._url = value;
            this._ios.loadRequest(NSURLRequest.requestWithURL(NSURL.URLWithString(value)));
        }
    };

    WebView.prototype.eval = function (script) {
        if (this.ios) {
            this.ios.stringByEvaluatingJavaScriptFromString(script);
        }
    };
    return WebView;
})(view.View);
exports.WebView = WebView;

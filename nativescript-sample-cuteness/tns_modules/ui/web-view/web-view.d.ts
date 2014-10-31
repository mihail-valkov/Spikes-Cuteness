
declare module "ui/web-view" {

    import observable = require("ui/core/observable");
    import view = require("ui/core/view");

    class WebView extends view.View {
        android: android.webkit.WebView;
        ios: UIWebView;

        url: string;

        canGoBack: boolean;
        canGoForward: boolean;

        goBack();
        goForward();

        eval(script: string);

        loadData(data: string, baseURL?: string, mimeType?: string, encoding?: string);
    }
}

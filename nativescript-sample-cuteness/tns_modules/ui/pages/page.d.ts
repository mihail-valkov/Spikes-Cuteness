declare module "ui/pages" {
    import observable = require("ui/core/observable");
    import view = require("ui/core/content-view");
    import frame = require("ui/frame");
    import styleScope = require("ui/core/style/style-scope");

    export class Page extends view.ContentView {
        css: string;
        navigationContext: any;

       /**
        * Gets the Frame object controlling this instance.
        */
        frame: frame.Frame;

        onNavigatingTo(context: any): void;
        onNavigatedTo(context: any): void;
        onNavigatingFrom(): void;
        onNavigatedFrom(): void;

        //@private
        _getStyleScope(): styleScope.StyleScope
        //@endprivate

        on(event: string, callback: (data: observable.EventData) => void);
        on(event: "navigatedTo", callback: (args: observable.EventData) => void);

        android: AndroidPage;
    }

    /**
     * Provides Android-specific page options.
     */
    export interface AndroidPage {
        /**
         * Gets or sets whether the page UI will be cached when navigating away from the page.
         */
        cacheOnNavigatedFrom: boolean;
        //onSaveInstanceState: (outState: android.os.Bundle) => void;
        //onRestoreInstanceState: (inState: android.os.Bundle) => void;
    }
} 
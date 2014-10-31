declare module "ui/frame" {
    import view = require("ui/core/view");
    import geometry = require("utils/geometry");
    import observable = require("ui/core/observable");

    // There is a cyclic reference here (pages module requires frame) but it is intented and needed.
    import pages = require("ui/pages");

    class Frame extends view.View {
        goBack();
        canGoBack(): boolean;
        navigate(pageModuleName: string);
        navigate(page: pages.Page);
        navigate(create: () => pages.Page);
        navigate(entry: NavigationEntry);

        backStack: Array<NavigationEntry>;
        currentPage: pages.Page;
        currentEntry: NavigationEntry;

        android: AndroidFrame;
        ios: iOSFrame;

        //@private
        //@endprivate
    }

   /**
    * Gets the topmost frame in the frames stack. An application will typically has one frame instance. Multiple frames handle nested (hierarchical) navigation scenarios.
    */
    function topmost(): Frame;

   /**
    * Navigates back using the navigation hierarchy (if any). Updates the Frame stack as needed.
    */
    function goBack();

    function stack(): Array<Frame>;

    interface NavigationEntry {
        moduleName?: string;
        page?: pages.Page;
        create?: () => pages.Page;
        context?: any;
        options?: NavigationOptions;
    }

    interface NavigationOptions {
        ios: iOSNavigationOptions;
    }
    /* tslint:disable */ 
    interface iOSNavigationOptions {
    /* tslint:enable */ 
        animated: boolean;
    }

    interface AndroidOptionEventData extends observable.EventData {
        item: android.view.MenuItem;
        cancel: boolean;
    }

    interface AndroidFrame extends observable.Observable {
        layout: android.view.ViewGroup;
        activity: android.app.Activity;
        currentActivity: android.app.Activity;
        actionBar: android.app.ActionBar;
        onActivityRequested(intent: android.content.Intent): Object;

        /**
         * Determines whether the application will display action bar or not.
         */
        showActionBar: boolean;
    }

    /* tslint:disable */ 
    interface iOSFrame {
        controller: UINavigationController;
        showNavigationBar: boolean;
    }

    module knownEvents {
        module android {
            var optionSelected: string;
        }
    }
}
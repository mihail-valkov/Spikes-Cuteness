declare module "ui/slide-out" {
    import view = require("ui/core/view");
    import dependencyObservable = require("ui/core/dependency-observable");

    var slideContentWidthProperty: dependencyObservable.Property;
    var optionsProperty: dependencyObservable.Property;

    class SlideOutControl extends view.View {
        android: android.support.v4.widget.DrawerLayout;
        ios: UIViewController;

        slideContent: view.View;
        mainContent: view.View;

        slideContentWidth: number;
        options: Options;

        openSlideContent(): void;
        closeSlideContent(): void;

        //@private
        _attachSlideContent(): void;
        _attachMainContent(): void;
        _detachSlideContent(): void;
        _detachMainContent(): void;
        //@endprivate
    }

    interface Options {
        android: AndroidOptions;
    }

    interface AndroidOptions {
        toggleImageResourceId: number;
        openDescriptionResourceId: number;
        closeDescriptionResourceId: number;
    }
} 
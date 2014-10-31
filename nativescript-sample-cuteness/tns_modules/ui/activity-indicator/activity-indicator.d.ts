declare module "ui/activity-indicator" {
    import view = require("ui/core/view");
    import dependencyObservable = require("ui/core/dependency-observable");

    var busyProperty: dependencyObservable.Property;

    class ActivityIndicator extends view.View {
        android: android.widget.ProgressBar;
        ios: UIActivityIndicatorView;

        busy: boolean;
    }
}
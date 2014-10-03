declare module "ui/progress" {
    import view = require("ui/core/view");
    import dependencyObservable = require("ui/core/dependency-observable");

    var valueProperty: dependencyObservable.Property;
    var maxValueProperty: dependencyObservable.Property;

    class Progress extends view.View {
        android: android.widget.ProgressBar;
        ios: UIProgressView;

        value: number;
        maxValue: number;
    }
}
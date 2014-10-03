declare module "ui/slider" {
    import view = require("ui/core/view");
    import dependencyObservable = require("ui/core/dependency-observable");

    var valueProperty: dependencyObservable.Property;
    var maxValueProperty: dependencyObservable.Property;

    class Slider extends view.View {
        android: android.widget.SeekBar;
        ios: UISlider;

        value: number;
        maxValue: number;
    }
}
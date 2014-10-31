declare module "ui/switch" {
    import view = require("ui/core/view");
    import dependencyObservable = require("ui/core/dependency-observable");

    var checkedProperty: dependencyObservable.Property;

    class Switch extends view.View {
        android: android.widget.Switch;
        ios: UISwitch;

        checked: boolean;
    }
}
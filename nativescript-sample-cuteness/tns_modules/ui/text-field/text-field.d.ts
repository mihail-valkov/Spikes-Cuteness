declare module "ui/text-field" {
    import view = require("ui/core/view");
    import dependencyObservable = require("ui/core/dependency-observable");

    var textProperty: dependencyObservable.Property;

    export class TextField extends view.View {
        android: android.widget.EditText;
        ios: UITextField;

        text: string;
    }
} 
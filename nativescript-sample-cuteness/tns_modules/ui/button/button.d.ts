declare module "ui/button" {
    import observable = require("ui/core/observable");
    import dependencyObservable = require("ui/core/dependency-observable");
    import view = require("ui/core/view");

    var textProperty: dependencyObservable.Property;

    class Button extends view.View {
        android: android.widget.Button;
        ios: UIButton;

        text: string;

        on(event: string, callback: (data: observable.EventData) => void);
        on(event: "click", callback: (args: observable.EventData) => void);
    }
}
declare module "ui/label" {
    import view = require("ui/core/view");
    import dependencyObservable = require("ui/core/dependency-observable");
    import proxy = require("ui/core/proxy");

    var textProperty: dependencyObservable.Property;
    var textWrapProperty: dependencyObservable.Property;

    /**
     * Represents a text label.
     */
    class Label extends view.View {
        android: android.widget.TextView;
        ios: UILabel;

        /**
         * Gets or sets the text contents of a Label.
         */
        text: string;
        
        /**
         * Gets or sets whether the Label wraps text or not.
         */
        textWrap: boolean;
    }
}
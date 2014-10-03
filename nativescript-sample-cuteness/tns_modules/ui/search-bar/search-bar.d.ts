declare module "ui/search-bar" {
    import view = require("ui/core/view");
    import observable = require("ui/core/observable");
    import dependencyObservable = require("ui/core/dependency-observable");

    var textProperty: dependencyObservable.Property;

    class SearchBar extends view.View {
        android: android.widget.SearchView;
        ios: UISearchBar;

        text: string;

        on(event: string, callback: (data: observable.EventData) => void);
        on(event: "submit", callback: (args: observable.EventData) => void);
        on(event: "close", callback: (args: observable.EventData) => void);
    }
}
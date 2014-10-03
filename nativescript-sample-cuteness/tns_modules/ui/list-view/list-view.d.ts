declare module "ui/list-view" {
    import observable = require("ui/core/observable");
    import view = require("ui/core/view");

    export module knownEvents {
        export var itemLoading: string;
        export var itemTap: string;
        export var loadMoreItems: string;
    }

    class ListView extends view.View {
        android: android.widget.ListView;
        ios: UITableView;

        items: any;
        refresh();

        isScrolling: boolean;

        on(event: string, callback: (data: observable.EventData) => void);
        on(event: "itemLoading", callback: (args: ItemEventData) => void);
        on(event: "itemTap", callback: (args: ItemEventData) => void);
        on(event: "loadMoreItems", callback: () => number);
    }

    interface ItemEventData extends observable.EventData {
        index: number;
        view: view.View;
    }
}

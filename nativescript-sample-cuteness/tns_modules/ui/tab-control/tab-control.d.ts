declare module "ui/tab-control" {
    import view = require("ui/core/view");

    interface TabEntry {
        title: string;
        view: view.View;
    }

    class TabControl extends view.View {
        items: Array<TabEntry>;
    }
} 
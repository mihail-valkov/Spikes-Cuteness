declare module "ui/panels/stack-panel" {
    import panel = require("ui/core/panel");

    export class StackPanel extends panel.Panel {
        orientation: number;
    }

    export enum Orientation {
        Horizontal = 0,
        Vertical = 1
    }
}
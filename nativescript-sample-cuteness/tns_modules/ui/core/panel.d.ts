// declare module "ui/core/panel" {
import view = require("ui/core/view");
import geometry = require("utils/geometry");

export declare class Panel extends view.View {
    children: Array<view.View>;
    addChild(view: view.View);
    removeChild(view: view.View);

    _measureChildren(availableSize: geometry.Size): geometry.Size;
    _arrangeChildren(finalSize: geometry.Size): void;
}
// }
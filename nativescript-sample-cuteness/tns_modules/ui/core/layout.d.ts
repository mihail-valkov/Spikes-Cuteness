//@private
declare module "ui/core/layout" {
    import view = require("ui/core/view");
    import geometry = require("utils/geometry");

    // TODO: We may remove the typed enums and use one generic one
    module alignment {
        var near: number;
        var center: number;
        var far: number;
        var stretch: number;
    }

    // TODO: Make this a module, a class is instantiatable and the generated JS code adds constructor function.
    class HorizontalAlignment {
        static left: number;
        static center: number;
        static right: number;
        static stretch: number;
    }

    class VerticalAlignment {
        static top: number;
        static center: number;
        static bottom: number;
        static stretch: number;
    }

    class LayoutInfo {
        constructor(view: view.View);
        minWidth: number;
        minHeight: number;

        width: number;
        height: number;

        maxWidth: number;
        maxHeight: number;

        isVisible: boolean;

        desiredSize: geometry.Size;
        margin: geometry.Thickness;
        horizontalAlignment: number;
        verticalAlignment: number;

        invalidateMeasure(): void;
        invalidateArrange(): void;

        measure(availableSize: geometry.Size, options?: any): void;
        arrange(arrangeSize: geometry.Size, options?: any): void;

        updateLayout(): void;

        static propagateSuspendLayout(layout: LayoutInfo): void;
        static propagateResumeLayout(parent: LayoutInfo, layout: LayoutInfo): void;
    }
}
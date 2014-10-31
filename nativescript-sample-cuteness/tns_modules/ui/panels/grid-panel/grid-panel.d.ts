declare module "ui/panels/grid-panel" {
    import panel = require("ui/core/panel");
    import view = require("ui/core/view");
    import observable = require("ui/core/observable");

    class GridUnitType {
        static auto: number;
        static pixel: number;
        static star: number;
    }

    class GridLength {
        static auto: GridLength;
        constructor(value: number, type: GridUnitType);
        gridUnitType: GridUnitType;
        isAbsolute: boolean;
        isAuto: boolean;
        isStar: boolean;
        value: number;
    }

    class ColumnDefinition {
        actualWidth: number;
        maxWidth: number;
        minWidth: number;
        width: GridLength;
    }

    class RowDefinition {
        actualHeight: number;
        maxHeight: number;
        minHeight: number;
        height: GridLength;
    }

    class GridLayout extends panel.Panel {
        rowCount: number;
        columnCount: number;        
        orientation: number;
    }

    class GridPanel extends panel.Panel {
        static getColumn(view: view.View): number;
        static setColumn(view: view.View, value: number): void;

        static getColumnSpan(view: view.View): number;
        static setColumnSpan(view: view.View, value: number): void;

        static getRow(view: view.View): number;
        static setRow(view: view.View, value: number): void;

        static getRowSpan(view: view.View): number;
        static setRowSpan(view: view.View, value: number): void;

        addColumnDefinition(definition: ColumnDefinition): void;
        addRowDefinition(definition: RowDefinition): void;

        removeColumnDefinition(definition: ColumnDefinition): boolean;
        removeRowDefinition(definition: RowDefinition): boolean;

        getColumnDefinitions(): Array<ColumnDefinition>;
        getRowDefinitions(): Array<RowDefinition>;
    }
}
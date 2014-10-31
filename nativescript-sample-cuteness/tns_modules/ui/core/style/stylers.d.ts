import dependencyObservable = require("ui/core/dependency-observable");
import containers = require("utils/containers");
import view = require("ui/core/view");

export declare function _registerDefaultStylers();

export declare function registerStyler(viewType: string, styler: Styler);

export declare function getStyler(view: view.View): Styler;

export declare class Styler {
    public onPropertyChanged(property: dependencyObservable.Property, view: view.View, newValue: any);
    public hasHandler(property: dependencyObservable.Property): boolean;
}

/**
 * The default styler that will be created if no specific styler is registered for view.
 */
export declare class DefaultStyler extends Styler {

}
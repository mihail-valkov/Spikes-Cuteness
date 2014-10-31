// declare module "ui/core/view" { TODO: Make ambient when needed
import style = require("ui/core/style/style");
import dependencyObservableDef = require("ui/core/dependency-observable");
import observable = require("ui/core/observable");
import types = require("utils/types");
import geometry = require("utils/geometry");
import layout = require("ui/core/layout");
import proxy = require("ui/core/proxy");
import gestures = require("ui/gestures");

export declare function getViewById(view: View, id: string): View;
export declare function eachDescendant(view: View, callback: (child: View) => boolean);
export declare function getAncestor(view: View, typeName: string): View;

export declare module knownEvents {
    export var loaded: string;
    export var unloaded: string;
}

export declare var isVisibleProperty: dependencyObservableDef.Property;

export declare class View extends proxy.ProxyObject {
   /**
    * Gets or sets the width of the view.
    */
    width: number;
   /**
    * Gets or sets the height of the view.
    */
    height: number;
   /**
    * Gets or sets the maximum width the view may grow to.
    */
    maxWidth: number;
   /**
    * Gets or sets the maximum height the view may grow to.
    */
    maxHeight: number;
   /**
    * Gets or sets the minimum width the view may grow to.
    */
    minWidth: number;
   /**
    * Gets or sets the minimum height the view may grow to.
    */
    minHeight: number;
   /**
    * Gets or sets the alignment of this view within its parent along the Horizontal axis.
    */
    horizontalAlignment: layout.HorizontalAlignment;
   /**
    * Gets or sets the alignment of this view within its parent along the Vertical axis.
    */
    verticalAlignment: layout.VerticalAlignment;
   /**
    * Gets or sets the margin of this view within its parent.
    */
    margin: geometry.Thickness;

    measure(availableSize: geometry.Size, options?: any): geometry.Size;
    arrange(finalRect: geometry.Rect, options?: any): void;

    observe(type: number, callback: (args: gestures.GestureEventData) => void): gestures.GesturesObserver;

    isVisible: boolean;

    style: style.Style;
    cssClass: string;
    cssType: string;
    visualState: string;
    id: string;

    parent: View;

    // lifecycle events
    onLoaded(): void;
    onUnloaded(): void;
    isLoaded: boolean;

    // TODO: Implement logic for stripping these lines out
    //@private
    _domId: number;

    _isAddedToNativeVisualTree: boolean;

    _addView(view: View);
    _removeView(view: View);
    /**
     * Performs the core logic of adding a child view to the native visual tree. Returns true if the view's native representation has been successfully added, false otherwise.
     */
    _addViewToNativeVisualTree(view: View): boolean;
    _removeViewFromNativeVisualTree(view: View);

    _eachChildView(callback: (child: View) => boolean);
    _childrenCount: number;

    _context: android.content.Context;
    _onAttached(context: android.content.Context): void;
    _onContextChanged(): void;
    _onDetached(force?: boolean): void;
    _createUI(): void;
    _getMeasureSpec(length: number, spec?: any): number;

    _measureOverride(availableSize: geometry.Size, options?: any): geometry.Size;
    _arrangeOverride(finalSize: geometry.Size, options?: any): void;

    _measureNativeView(availableSize: geometry.Size, options?: any): geometry.Size;

    _invalidateMeasure(): void;
    _invalidateArrange(): void;

    _updateLayout(): void;

    _goToVisualState(state: string);
    _setBounds(rect: geometry.Rect): void;
    _getBounds(): geometry.Rect;
    _nativeView: any;
    //@endprivate
}
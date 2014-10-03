declare module "ui/gestures" {
    import observable = require("ui/core/observable");
    import view = require("ui/core/view");

    export enum GestureTypes {
        Tap,
        DoubleTap,
        Pinch,
        Pan,
        Swipe,
        Rotation,
        LongPress
    }

    export enum SwipeDirection {
        Right,
        Left,
        Up,
        Down
    }

    export interface GestureEventData {
        type: GestureTypes;
        view: view.View;
        ios: UIGestureRecognizer
        android: any
    }

    export interface PinchGestureEventData extends GestureEventData {
        scale: number;
    }

    export interface SwipeGestureEventData extends GestureEventData {
        direction: SwipeDirection;
    }

    export interface RotationGestureEventData extends GestureEventData {
        rotation: number;
    }

    /**
     * Provides options for the GesturesObserver.
     */
    class GesturesObserver {
        constructor(callback: (args: GestureEventData) => void);

        observe(target: view.View, type: GestureTypes);

        disconnect();
    }

    export function observe(target: view.View, type: GestureTypes, callback: (args: GestureEventData) => void): GesturesObserver;

    export function toString(type: GestureTypes, separator?: string): string;
    export function fromString(type: string): GestureTypes;
}
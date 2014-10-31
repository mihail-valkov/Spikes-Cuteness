declare module "color" {
    export class Color {
        constructor(hex: string);
        constructor(argb: number);
        constructor(alpha: number, red: number, green: number, blue: number);

       /**
        * Gets the Alpha component (in the [0, 255] range) of this color. This is a read-only property.
        */
        public a: number;

       /**
        * Gets the Red component (in the [0, 255] range) of this color. This is a read-only property.
        */
        public r: number;

       /**
        * Gets the Green component (in the [0, 255] range) of this color. This is a read-only property.
        */
        public g: number;

       /**
        * Gets the Blue component (in the [0, 255] range) of this color. This is a read-only property.
        */
        public b: number;

       /**
        * Gets the Hexademical string representation of this color. This is a read-only property.
        */
        public hex: string;

       /**
        * Gets the Argb Number representation of this color where each 8 bits represent a single color component. This is a read-only property.
        */
        public argb: number;

       /**
        * Gets the known name of this instance. Defined only if it has been constructed from a known color name - e.g. "red". This is a read-only property.
        */
        public name: string;

       /**
        * Gets the android-specific integer value representation. Same as the Argb one. This is a read-only property.
        */
        android: number;

       /**
        * Gets the iOS-specific UIColor value representation. This is a read-only property.
        */
        ios: UIColor;
    }
}
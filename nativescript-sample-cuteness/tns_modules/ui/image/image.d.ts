declare module "ui/image" {

    import imageSource = require("image-source");
    import view = require("ui/core/view");

    class Image extends view.View {
        android: android.widget.ImageView;
        ios: UIImageView;

        /**
         * Gets or sets the image source of the image.
         */
        source: imageSource.ImageSource;

        /**
         * Gets or sets the URL of the image.
         */
        url: string;

        /**
         * Gets a value indicating if the image is currently loading
         */
        isLoading: boolean;

        /**
         * Gets or sets the image stretch mode.
         */
        stretch: string;
    }

    export module stretch {
        /**
         * The image preserves its original size.
         */
        export var none: string;

        /**
         * The image is resized to fit in the destination dimensions while it preserves its native aspect ratio.
         */
        export var aspectFill: string;

        /**
         * The image is resized to fill the destination dimensions while it preserves
         * its native aspect ratio. If the aspect ratio of the destination rectangle differs from the image,
         * the image is clipped to fit in the destination
         */
        export var aspectFit: string;

        /**
         * The image is resized to fill the destination dimensions. The aspect ratio is not preserved.
         */
        export var fill: string;
    }

}
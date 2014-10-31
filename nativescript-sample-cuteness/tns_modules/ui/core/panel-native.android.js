var geometry = require("utils/geometry");

function getLength(measureLength, desiredLength, measureSpecMode) {
    switch (measureSpecMode) {
        case android.view.View.MeasureSpec.EXACTLY:
            return measureLength;

        case android.view.View.MeasureSpec.AT_MOST:
            return Math.min(measureLength, desiredLength);

        case android.view.View.MeasureSpec.UNSPECIFIED:
        default:
            return desiredLength;
    }
}

exports.Panel = android.view.ViewGroup.extend({
    get owner() {
        return this._owner;
    },
    onMeasure: function (widthMeasureSpec, heightMeasureSpec) {
        var widthSpecMode = android.view.View.MeasureSpec.getMode(widthMeasureSpec);
        var widthSpecSize = android.view.View.MeasureSpec.getSize(widthMeasureSpec);

        var heightSpecMode = android.view.View.MeasureSpec.getMode(heightMeasureSpec);
        var heightSpecSize = android.view.View.MeasureSpec.getSize(heightMeasureSpec);

        if (widthSpecSize === 0 && widthSpecMode === android.view.View.MeasureSpec.UNSPECIFIED) {
            widthSpecSize = Number.POSITIVE_INFINITY;
        }

        if (heightSpecSize === 0 && heightSpecMode === android.view.View.MeasureSpec.UNSPECIFIED) {
            heightSpecSize = Number.POSITIVE_INFINITY;
        }

        var metrics = this.getContext().getResources().getDisplayMetrics();
        var density = metrics.density;

        var measureWidth = widthSpecSize / density;
        var measureHeight = heightSpecSize / density;

        var desiredSize = this.owner.measure(new geometry.Size(measureWidth, measureHeight), true);

        var desiredWidth = getLength(widthSpecSize, Math.round(desiredSize.width * density), widthSpecMode);
        var desiredHeight = getLength(heightSpecSize, Math.round(desiredSize.height * density), heightSpecMode);

        this.setMeasuredDimension(desiredWidth, desiredHeight);
    },
    onLayout: function (changed, left, top, right, bottom) {
        var metrics = this.getContext().getResources().getDisplayMetrics();
        var density = metrics.density;

        var arrangeRect = new geometry.Rect(left / density, top / density, (right - left) / density, (bottom - top) / density);
        this.owner.arrange(arrangeRect, true);
    }
});

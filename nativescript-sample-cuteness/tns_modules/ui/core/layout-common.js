(function (alignment) {
    alignment.left = 0;
    alignment.center = 1;
    alignment.right = 2;
    alignment.stretch = 3;
})(exports.alignment || (exports.alignment = {}));
var alignment = exports.alignment;

var HorizontalAlignment = (function () {
    function HorizontalAlignment() {
    }
    HorizontalAlignment.left = 0;
    HorizontalAlignment.center = 1;
    HorizontalAlignment.right = 2;
    HorizontalAlignment.stretch = 3;
    return HorizontalAlignment;
})();
exports.HorizontalAlignment = HorizontalAlignment;

var VerticalAlignment = (function () {
    function VerticalAlignment() {
    }
    VerticalAlignment.top = 0;
    VerticalAlignment.center = 1;
    VerticalAlignment.bottom = 2;
    VerticalAlignment.stretch = 3;
    return VerticalAlignment;
})();
exports.VerticalAlignment = VerticalAlignment;

var MinMax = (function () {
    function MinMax(layoutInfo) {
        this.minHeight = layoutInfo.minHeight;
        this.maxHeight = layoutInfo.maxHeight;
        var length = layoutInfo.height;

        var current = isNaN(length) ? Number.POSITIVE_INFINITY : length;
        this.maxHeight = Math.max(Math.min(current, this.maxHeight), this.minHeight);

        current = isNaN(length) ? 0.0 : length;
        this.minHeight = Math.max(Math.min(this.maxHeight, current), this.minHeight);

        this.maxWidth = layoutInfo.maxWidth;
        this.minWidth = layoutInfo.minWidth;
        length = layoutInfo.width;

        current = isNaN(length) ? Number.POSITIVE_INFINITY : length;
        this.maxWidth = Math.max(Math.min(current, this.maxWidth), this.minWidth);

        current = isNaN(length) ? 0.0 : length;
        this.minWidth = Math.max(Math.min(this.maxWidth, current), this.minWidth);
    }
    MinMax.prototype.toString = function () {
        return "minWidth: " + this.minWidth + ", maxWidth: " + this.maxWidth + ", minHeight: " + this.minHeight + ", maxHeight: " + this.maxHeight;
    };
    return MinMax;
})();
exports.MinMax = MinMax;

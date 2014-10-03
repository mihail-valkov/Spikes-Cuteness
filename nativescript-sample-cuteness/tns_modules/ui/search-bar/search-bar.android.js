var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/search-bar/search-bar-common");

function onTextPropertyChanged(data) {
    var bar = data.object;
    if (!bar.android) {
        return;
    }

    bar.android.setQuery(data.newValue, false);
}

common.textProperty.metadata.onSetNativeValue = onTextPropertyChanged;

require("utils/module-merge").merge(common, exports);

var SearchBar = (function (_super) {
    __extends(SearchBar, _super);
    function SearchBar() {
        _super.apply(this, arguments);
    }
    SearchBar.prototype._createUI = function () {
        var _this = this;
        this._android = new android.widget.SearchView(this._context);

        this._android.setOnQueryTextListener(new android.widget.SearchView.OnQueryTextListener({
            onQueryTextChange: function (newText) {
                _this._onPropertyChangedFromNative(common.textProperty, newText);
                return true;
            },
            onQueryTextSubmit: function (query) {
                _this.emit("submit");
                return true;
            }
        }));

        this._android.setOnCloseListener(new android.widget.SearchView.OnCloseListener({
            onClose: function () {
                _this.emit("close");
                return true;
            }
        }));
    };

    Object.defineProperty(SearchBar.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    return SearchBar;
})(common.SearchBar);
exports.SearchBar = SearchBar;

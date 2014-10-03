var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/search-bar/search-bar-common");

function onTextPropertyChanged(data) {
    var bar = data.object;
    bar.ios.text = data.newValue;
}

common.textProperty.metadata.onSetNativeValue = onTextPropertyChanged;

require("utils/module-merge").merge(common, exports);

var TEXT = "text";

var SearchBarDelegateClass = NSObject.extend({
    searchBarTextDidChange: function (searchBar, searchText) {
        this["_owner"]._onPropertyChangedFromNative(common.textProperty, searchText);
    },
    searchBarCancelButtonClicked: function (searchBar) {
        searchBar.resignFirstResponder();
        this["_owner"].emit("close");
    },
    searchBarSearchButtonClicked: function (searchBar) {
        searchBar.resignFirstResponder();
        this["_owner"].emit("submit");
    }
}, {
    protocols: [UISearchBarDelegate]
});

var SearchBar = (function (_super) {
    __extends(SearchBar, _super);
    function SearchBar() {
        _super.call(this);
        this._ios = new UISearchBar();

        this._delegate = new SearchBarDelegateClass();
        this._delegate["_owner"] = this;
        this._ios.delegate = this._delegate;
    }
    Object.defineProperty(SearchBar.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    return SearchBar;
})(common.SearchBar);
exports.SearchBar = SearchBar;

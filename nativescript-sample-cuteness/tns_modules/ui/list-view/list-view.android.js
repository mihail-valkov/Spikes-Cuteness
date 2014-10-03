var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/list-view/list-view-common");

var ITEMLOADING = common.knownEvents.itemLoading;
var LOADMOREITEMS = common.knownEvents.loadMoreItems;
var ITEMTAP = common.knownEvents.itemTap;

require("utils/module-merge").merge(common, exports);

var ListView = (function (_super) {
    __extends(ListView, _super);
    function ListView() {
        _super.apply(this, arguments);
    }
    ListView.prototype._createUI = function () {
        var _this = this;
        this._android = new android.widget.ListView(this._context);

        var adapter = new android.widget.BaseAdapter.extend({
            getCount: function () {
                return _this.items ? _this.items.length : 0;
            },
            getItem: function (i) {
                return _this.items && i < _this.items.length ? (_this.items.getItem ? _this.items.getItem(i) : _this.items[i]) : null;
            },
            getItemId: function (i) {
                return long(0);
            },
            getView: function (index, convertView, parent) {
                var holder = convertView ? convertView.getTag() : null;

                var v = holder ? holder.view : null;

                var args = { eventName: ITEMLOADING, object: _this, index: index, view: v };

                _this.notify(args);

                if (args.view && !args.view.parent) {
                    _this._addView(args.view);

                    convertView = args.view.android;

                    holder = new java.lang.Object();
                    holder.view = args.view;

                    convertView.setTag(holder);
                }

                return convertView;
            }
        })();

        this.android.setAdapter(adapter);

        this.android.setOnScrollListener(new android.widget.AbsListView.OnScrollListener({
            onScrollStateChanged: function (view, scrollState) {
                _this._setValue(common.isScrollingProperty, scrollState === android.widget.AbsListView.OnScrollListener.SCROLL_STATE_FLING || scrollState === android.widget.AbsListView.OnScrollListener.SCROLL_STATE_TOUCH_SCROLL);

                if (scrollState === android.widget.AbsListView.OnScrollListener.SCROLL_STATE_IDLE) {
                    _this.refresh();
                }
            },
            onScroll: function (view, firstVisibleItem, visibleItemCount, totalItemCount) {
                if (totalItemCount > 0 && firstVisibleItem + visibleItemCount === totalItemCount) {
                    _this.notify({ eventName: LOADMOREITEMS, object: _this });
                }
            }
        }));

        this.android.setOnItemClickListener(new android.widget.AdapterView.OnItemClickListener({
            onItemClick: function (parent, convertView, index, id) {
                var holder = convertView ? convertView.getTag() : null;
                var v = holder ? holder.view : null;
                var args = { eventName: ITEMTAP, object: _this, index: index, view: v };
                _this.notify(args);
            }
        }));
    };

    Object.defineProperty(ListView.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });

    ListView.prototype.refresh = function () {
        if (!this._android || !this._android.Adapter) {
            return;
        }

        this.android.Adapter.notifyDataSetChanged();
    };
    return ListView;
})(common.ListView);
exports.ListView = ListView;

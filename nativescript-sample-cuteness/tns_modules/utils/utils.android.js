var application = require("application");

(function (ad) {
    (function (collections) {
        function stringArrayToStringSet(str) {
            var hashSet = new java.util.HashSet();
            if ("undefined" !== typeof str) {
                for (var element in str) {
                    hashSet.add('' + str[element]);
                }
            }
            return hashSet;
        }
        collections.stringArrayToStringSet = stringArrayToStringSet;

        function stringSetToStringArray(stringSet) {
            var arr = [];
            if ("undefined" !== typeof stringSet) {
                var it = stringSet.iterator();
                while (it.hasNext()) {
                    var element = '' + it.next();
                    arr.push(element);
                }
            }

            return arr;
        }
        collections.stringSetToStringArray = stringSetToStringArray;
    })(ad.collections || (ad.collections = {}));
    var collections = ad.collections;

    (function (layout) {
        function getDevicePixels(independentPixels, context) {
            return android.util.TypedValue.applyDimension(android.util.TypedValue.COMPLEX_UNIT_DIP, independentPixels, context.getResources().getDisplayMetrics());
        }
        layout.getDevicePixels = getDevicePixels;
    })(ad.layout || (ad.layout = {}));
    var layout = ad.layout;

    (function (id) {
        id.home = 0x0102002c;
    })(ad.id || (ad.id = {}));
    var id = ad.id;

    (function (_resources) {
        function getDrawableId(name) {
            return getId(":drawable/" + name);
        }
        _resources.getDrawableId = getDrawableId;

        function getStringId(name) {
            return getId(":string/" + name);
        }
        _resources.getStringId = getStringId;

        function getId(name) {
            var context = application.android.context;
            var resources = context.getResources();
            var packageName = context.getPackageName();
            var uri = packageName + name;
            return resources.getIdentifier(uri, null, null);
        }
        _resources.getId = getId;
    })(ad.resources || (ad.resources = {}));
    var resources = ad.resources;

    function async(doInBackground, callback) {
        var handlerType = android.os.Handler.extend({
            handleMessage: function (message) {
                callback(message.obj);
            }
        });

        var handler = new handlerType(android.os.Looper.getMainLooper());

        var runnable = new java.lang.Runnable({
            run: function () {
                var result = doInBackground();
                var message = handler.obtainMessage(1, result);
                handler.sendMessage(message);
            }
        });

        var thread = new java.lang.Thread(runnable);
        thread.start();
    }
    ad.async = async;
})(exports.ad || (exports.ad = {}));
var ad = exports.ad;

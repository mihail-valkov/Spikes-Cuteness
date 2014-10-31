(function (ios) {
    (function (collections) {
        function jsArrayToNSArray(str) {
            var arr = new NSMutableArray();
            if ("undefined" !== typeof str) {
                for (var element in str) {
                    arr.addObject(str[element]);
                }
            }
            return arr;
        }
        collections.jsArrayToNSArray = jsArrayToNSArray;

        function nsArrayToJSArray(a) {
            var arr = [];
            if ("undefined" !== typeof a) {
                for (var i = 0; i < a.count(); i++) {
                    arr.push(a.objectAtIndex(i));
                }
            }

            return arr;
        }
        collections.nsArrayToJSArray = nsArrayToJSArray;
    })(ios.collections || (ios.collections = {}));
    var collections = ios.collections;
})(exports.ios || (exports.ios = {}));
var ios = exports.ios;

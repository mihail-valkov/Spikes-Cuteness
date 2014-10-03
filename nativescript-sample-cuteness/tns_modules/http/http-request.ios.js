var promises = require("promises");

var imageSource = require("image-source");

var USER_AGENT = "Mozilla/5.0 (iPad; CPU OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5355d Safari/8536.25";

function request(options) {
    var d = promises.defer();

    try  {
        var sessionConfig = NSURLSessionConfiguration.defaultSessionConfiguration();
        var queue = NSOperationQueue.mainQueue();
        var session = NSURLSession.sessionWithConfigurationDelegateDelegateQueue(sessionConfig, null, queue);

        var urlRequest = NSMutableURLRequest.requestWithURL(NSURL.URLWithString(options.url));

        urlRequest.HTTPMethod = typeof options.method !== "undefined" ? options.method : "GET";

        urlRequest.setValueForHTTPHeaderField(USER_AGENT, "User-Agent");

        if (options.headers) {
            for (var header in options.headers) {
                urlRequest.setValueForHTTPHeaderField(options.headers[header], header);
            }
        }

        if (typeof options.timeout === "number") {
            urlRequest.timeoutInterval = options.timeout * 1000;
        }

        if (typeof options.content === "string") {
            urlRequest.HTTPBody = NSString.alloc().initWithString(options.content).dataUsingEncoding(4);
        } else if (typeof options.content !== "undefined") {
            urlRequest.HTTPBody = options.content;
        }

        var dataTask = session.dataTaskWithRequestCompletionHandler(urlRequest, function (data, response, error) {
            if (error) {
                d.reject(new Error(error.localizedDescription));
            } else {
                var headers = {};
                var headerFields = response.allHeaderFields;
                var keys = headerFields.allKeys;

                for (var i = 0, l = keys.count; i < l; i++) {
                    var key = keys.objectAtIndex(i);
                    headers[key] = headerFields.valueForKey(key);
                }

                d.resolve({
                    content: {
                        raw: data,
                        toString: function () {
                            return NSDataToString(data);
                        },
                        toJSON: function () {
                            return JSON.parse(NSDataToString(data));
                        },
                        toImage: function () {
                            var imagePromise = promises.defer();
                            imagePromise.resolve(imageSource.fromData(data));
                            return imagePromise.promise();
                        }
                    },
                    statusCode: response.statusCode,
                    headers: headers
                });
            }
        });

        dataTask.resume();
    } catch (ex) {
        d.reject(ex);
    }
    return d.promise();
}
exports.request = request;

function NSDataToString(data) {
    return NSString.alloc().initWithDataEncoding(data, 4).toString();
}

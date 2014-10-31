var promises = require("promises");

var players = [];

var PlayerDelegateClass = NSObject.extend({
    audioPlayerDidFinishPlayingSuccessfully: function (player, successfully) {
        if (successfully) {
            this["_deferred"].resolve();
        } else {
            this["_deferred"].reject(new Error("error playing: " + this["_url"]));
        }

        var index = players.indexOf(player);
        if (-1 < index) {
            players.splice(index, 1);
        }
    }
}, {
    protocols: [AVAudioPlayerDelegate]
});

exports.playAudioURL = function (url) {
    var deferred = promises.defer();

    var errorRef = RefValue.create();
    var player = AVAudioPlayer.alloc().initWithContentsOfURLError(NSURL.URLWithString(url), errorRef);
    var error = errorRef.value;
    if (error) {
        deferred.reject(new Error(error.localizedDescription));
        return deferred.promise();
    }

    var delegate = new PlayerDelegateClass();
    delegate["_deferred"] = deferred;
    delegate["_url"] = url;

    player.delegate = delegate;
    player.prepareToPlay();
    player.play();

    players.push(player);

    return deferred.promise();
};

exports.playAudioFile = function (path) {
    return exports.playAudioURL(NSURL.fileURLWithPath(path).absoluteString);
};

exports.playVideoURL = function (url, view) {
    var d = promises.defer();

    var player = MPMoviePlayerController.alloc().initWithContentURL(NSURL.URLWithString(url));
    player.view.frame = view.ios.bounds;

    player.view.autoresizingMask = 16 /* UIViewAutoresizingFlexibleHeight */ | 2 /* UIViewAutoresizingFlexibleWidth */;
    view.ios.addSubview(player.view);

    player.prepareToPlay();
    player.play();

    players.push(player);

    return d.promise();
};

exports.playVideoFile = function (path, view) {
    return exports.playVideoURL(NSURL.fileURLWithPath(path).absoluteString, view);
};

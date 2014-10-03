
declare module "media-player" {

    import promises = require("promises");
    import view = require("ui/core/view");

   /**
    * play audio file
    */
    function playAudioFile(path: string): promises.Promise<void>;
    function playAudioURL(url: string): promises.Promise<void>;

    /**
     * play video file
     */
    function playVideoURL(url: string, view: view.View): promises.Promise<void>;
    function playVideoFile(path: string, view: view.View): promises.Promise<void>;
}

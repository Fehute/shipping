/*
todo:
* handle input for the current device (expand to mobile)
* instead of directly sending the event data, create our own interface for
it and convert all device input data to the form/stuff we care about
*/
define(["require", "exports", 'game/Game'], function(require, exports, game) {
    var ReleaseMode;
    (function (ReleaseMode) {
        ReleaseMode[ReleaseMode["up"] = 0] = "up";
        ReleaseMode[ReleaseMode["click"] = 1] = "click";
    })(ReleaseMode || (ReleaseMode = {}));

    var releaseCondition = 0 /* up */;

    function grab(el, callback) {
        $(el).on("click", function (e) {
            if (!game.State.crate) {
                callback(e);
                e.originalEvent.preventDefault();
                e.originalEvent.stopPropagation();
                return false;
            }
        });
        $(el).on("dragstart", function (e) {
            if (!game.State.crate) {
                if (e.originalEvent["dataTransfer"]) {
                    e.originalEvent["dataTransfer"].setDragImage($("#dragPreview")[0], 0, 0);
                    e.originalEvent["dataTransfer"].setData("text/plain", "crate");
                }
                callback(e);
            } else {
                return false;
            }
        });
        $(el).on("dragend", function (e) {
        });
    }
    exports.grab = grab;

    function release(el, callback) {
        var clickRelease = function (e) {
            if (game.State.crate && !e.isDefaultPrevented()) {
                callback(e);
            }
        };
        $(el).on("mouseup", clickRelease);
        $(el).on("dragenter", function (e) {
        });
        $(el).on("dragover", function (e) {
            e.originalEvent.preventDefault();
            return false;
        });
        $(el).on("drop", function (e) {
            if (game.State.crate) {
                callback(e);
            }
        });
    }
    exports.release = release;
});
//# sourceMappingURL=Input.js.map

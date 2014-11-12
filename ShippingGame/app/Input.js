/*
todo:
* handle input for the current device (expand to mobile)
* instead of directly sending the event data, create our own interface for
it and convert all device input data to the form/stuff we care about
*/
define(["require", "exports", 'game/Game'], function(require, exports, game) {
    var InputMode;
    (function (InputMode) {
        InputMode[InputMode["DnD"] = 0] = "DnD";
        InputMode[InputMode["Click"] = 1] = "Click";
    })(InputMode || (InputMode = {}));

    var inputMode = 0 /* DnD */;

    function grab(el, callback) {
        if (inputMode == 0 /* DnD */) {
            $(el).on("mousedown", function (e) {
                if (!game.State.crate) {
                    callback(e);
                }
            });
        } else if (inputMode == 1 /* Click */) {
            $(el).on("click", function (e) {
                if (!game.State.crate) {
                    e.originalEvent.preventDefault();
                    e.originalEvent.stopPropagation();
                    callback(e);
                    return false;
                }
            });
        }
    }
    exports.grab = grab;

    function release(el, callback) {
        var clickRelease = function (e) {
            if (game.State.crate && !e.isDefaultPrevented()) {
                callback(e);
            }
        };
        if (inputMode == 0 /* DnD */) {
            $(el).on("mouseup", clickRelease);
        } else if (inputMode == 1 /* Click */) {
            $(el).on("click", clickRelease);
        }
    }
    exports.release = release;
});
//# sourceMappingURL=Input.js.map

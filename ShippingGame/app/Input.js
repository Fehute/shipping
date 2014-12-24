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

    var inputMode = 1 /* Click */;

    function grab(el, callback) {
        if (inputMode == 0 /* DnD */) {
            $(el).on("mousedown", function (e) {
                if (!game.State.crates().length && e.which == 1) {
                    callback(e);
                } else if (e.which == 3 && game.State.crates().length < game.State.maxHeldCrates()) {
                    e.originalEvent.preventDefault();
                    e.originalEvent.stopPropagation();
                    callback(e);
                    return false;
                }
            });
        } else if (inputMode == 1 /* Click */) {
            $(el).on("click", function (e) {
                if (!game.State.crates().length && e.which == 1) {
                    e.originalEvent.preventDefault();
                    e.originalEvent.stopPropagation();
                    callback(e);
                    return false;
                }
            });
            $(el).on("mousedown", function (e) {
                if (e.which == 3 && game.State.crates().length < game.State.maxHeldCrates()) {
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
            if (game.State.crates().length && !e.isDefaultPrevented() && e.which == 1) {
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

/*
todo:
* handle input for the current device (expand to mobile)
* instead of directly sending the event data, create our own interface for
it and convert all device input data to the form/stuff we care about
*/
define(["require", "exports"], function(require, exports) {
    

    function grab(el, callback) {
        $(el).mousedown(callback);
    }
    exports.grab = grab;

    function release(el, callback) {
        $(el).mouseup(callback);
    }
    exports.release = release;
});
//# sourceMappingURL=Input.js.map

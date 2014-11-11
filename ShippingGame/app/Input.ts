
/*
    todo:
    * handle input for the current device (expand to mobile)
    
    * instead of directly sending the event data, create our own interface for
    it and convert all device input data to the form/stuff we care about
*/

import game = require('game/Game');

enum ReleaseMode {
    up,
    click
}

var releaseCondition: ReleaseMode = ReleaseMode.up;

export function grab(el: JQuery, callback: (e: any) => void);
export function grab(el: HTMLElement, callback: (e: any) => void);
export function grab(el: any, callback: (e: any) => void) {
    $(el).on("click", (e) => {
        if (!game.State.crate) {
            callback(e);
            e.originalEvent.preventDefault();
            e.originalEvent.stopPropagation();
            return false;
        }
    });
    $(el).on("dragstart", (e: JQueryEventObject) => {
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
    $(el).on("dragend", (e: JQueryEventObject) => {
    });
}



export function release(el: JQuery, callback: (e: any) => void);
export function release(el: HTMLElement, callback: (e: any) => void);
export function release(el: any, callback: (e: any) => void) {
    var clickRelease = function (e) {
        if (game.State.crate && !e.isDefaultPrevented()) {
            callback(e);
        }
    }
    $(el).on("mouseup", clickRelease);
    $(el).on("dragenter", (e) => {
    });
    $(el).on("dragover", (e) => {
        e.originalEvent.preventDefault();
        return false;
    });
    $(el).on("drop", (e) => {
        if (game.State.crate) {
            callback(e);
        }
    });
}

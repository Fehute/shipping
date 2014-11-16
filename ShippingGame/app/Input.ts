
/*
    todo:
    * handle input for the current device (expand to mobile)
    
    * instead of directly sending the event data, create our own interface for
    it and convert all device input data to the form/stuff we care about
*/

import game = require('game/Game');
import common = require('common');

enum InputMode {
    DnD,
    Click
}

var inputMode = InputMode.Click;

export function grab(el: JQuery, callback: (e: any) => void);
export function grab(el: HTMLElement, callback: (e: any) => void);
export function grab(el: any, callback: (e: any) => void) {
    if (inputMode == InputMode.DnD) {
        $(el).on("mousedown", (e: JQueryMouseEventObject) => {
            if (!game.State.crates().length && e.which == 1) {
                callback(e);
            } else if (e.which == 3 && game.State.crates().length < common.Configuration.maxHeldCrates) {
                e.originalEvent.preventDefault();
                e.originalEvent.stopPropagation();
                callback(e);
                return false;
            }
        });
    } else if (inputMode == InputMode.Click) {
        $(el).on("click", (e) => {
            if (!game.State.crates().length && e.which == 1) {
                e.originalEvent.preventDefault();
                e.originalEvent.stopPropagation();
                callback(e);
                return false;
            }
        });
        $(el).on("mousedown", (e: JQueryMouseEventObject) => {
            if (e.which == 3 && game.State.crates().length < common.Configuration.maxHeldCrates) {
                e.originalEvent.preventDefault();
                e.originalEvent.stopPropagation();
                callback(e);
                return false;
            }
        });
    }
}



export function release(el: JQuery, callback: (e: any) => void);
export function release(el: HTMLElement, callback: (e: any) => void);
export function release(el: any, callback: (e: any) => void) {
    var clickRelease = function (e: JQueryMouseEventObject) {
        if (game.State.crates().length && !e.isDefaultPrevented() && e.which == 1) {
            callback(e);
        }
    }
    if (inputMode == InputMode.DnD) {
        $(el).on("mouseup", clickRelease);
    } else if (inputMode == InputMode.Click) {
        $(el).on("click", clickRelease);
    }
}

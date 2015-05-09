//https://github.com/borisyankov/DefinitelyTyped

///<reference path="lib/dts/require/require.d.ts" />
///<reference path="lib/dts/knockout/knockout.d.ts" />
///<reference path="lib/dts/jquery/jquery.d.ts" />
///<reference path="lib/dts/gridster/gridster.d.ts" />

import game = require("game/Game");
import ko = require('knockout');

class App {
    element: HTMLElement;
    game: game.Game;

    constructor(element: HTMLElement) {
        this.element = element;
        this.game = new game.Game($('.gameContainer'));
        document.oncontextmenu = function () { return false; };
        //ko.applyBindings(this, this.element);
    }

}


//ko["amdTemplateEngine"]["defaultPath"] = 'game/templates';
var el = $('#content')[0];
var greeter = new App(el);

//todo abilities
//cooldown
//visual indicators
//shop/acquisition


//todo here:
//game configuration
//custom knockout bindings
//desktop/mobile handling
//input


//Game has Board
//Board has field and UI
//Field has stacks
//Stacks have crates
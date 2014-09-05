///<amd-dependency path="text!game/templates/Game.tmpl.html" />

import common = require('common');
import board = require('game/Board');

export class Game extends common.BaseModule{
    board: board.Board;

    constructor(container:JQuery, args?:any) {
        super(container, Templates.game);
        this.board = new board.Board($('.boardContainer'));
    }
}

module Templates {
    export var game = <string>require('text!game/templates/Game.tmpl.html');
}
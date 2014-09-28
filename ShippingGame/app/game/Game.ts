///<amd-dependency path="text!game/templates/Game.tmpl.html" />

import common = require('common');
import board = require('game/Board');

export class Game extends common.BaseModule {
    board: board.Board;

    constructor(container:JQuery, args?:any) {
        super(container, Templates.game);
        this.board = new board.Board($('.boardContainer'));
    }
}

export class State {
    static crate: CrateData = null;

}

export interface CrateData {
    type: CrateType;
}

export class CrateType {
    static one = 0;
    static two = 1;
    static three = 2;
    static four = 3;
    static five = 4;

    static styles = ["one", "two", "three", "four", "five"];

    getStyle(): string {
        return CrateType.styles[this.type];
    }

    static getRandomType(): number {
        var types = [
            CrateType.one,
            CrateType.two,
            CrateType.three,
            CrateType.four,
            CrateType.five
        ]

        return types[Math.floor(Math.random() * 5)];
    }

    constructor(public type: number) { }
}

module Templates {
    export var game = <string>require('text!game/templates/Game.tmpl.html');
}
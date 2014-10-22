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
    count?: number;
    checked?: boolean;
    matchNumber?: number;
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

    is(t: number) {
        return this.type == t;
    }

    static getRandomType(notType?: CrateType): number {
        var types = [
            CrateType.one,
            CrateType.two,
            CrateType.three,
            CrateType.four,
            CrateType.five
        ].filter((t) => !notType || !notType.is(t));

        return types[Math.floor(Math.random() * types.length)];
    }

    matches(c: CrateType): Boolean {
        return this.type == c.type;
    }

    constructor(public type: number) { }
}

module Templates {
    export var game = <string>require('text!game/templates/Game.tmpl.html');
}

/*
 * powers:
 * -extra delay before matching
 * -depth charge
 */
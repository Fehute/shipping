///<amd-dependency path="text!game/templates/Game.tmpl.html" />

import common = require('common');
import board = require('game/Board');
import ko = require('knockout');
import modals = require('game/Modals');
import status = require('game/Status');

export class Game extends common.BaseModule {
    board: board.Board;
    modals: modals.Modals;
    lost: boolean = false;

    constructor(container: JQuery, args?: any) {
        super(container, Templates.game);
        State.game = this;
        this.board = new board.Board($('.boardContainer'));
        this.modals = new modals.Modals($('.modalsContainer'));
        State.score.subscribe((score) => {
            if (score >= State.pointThreshhold()) {
                this.board.field.pause();
                common.Configuration.increaseIntensity();

                var self = this;
                var restart = this.restart;
                this.modals.nextLevel(() => restart.apply(self));
            }
        });
    }

    gameLost() {
        if (!this.lost) {
            this.lost = true;
            this.board.pause();

            var self = this;
            var restart = this.restart;
            this.modals.gameLost(() => {
                State.score(0);
                State.chainValue = common.Configuration.baseChainValue;
                State.intensity(1);
                State.pointThreshhold(common.Configuration.basePointThreshhold);
                this.board.status.resetTimer();
                State.crates([]);
                restart.apply(self);
             });
        }
    }

    restart() {
        this.lost = false;
        this.board.reset();
    }
}

export class State {
    static game: Game;
    static crates: KnockoutObservableArray<CrateData> = ko.observableArray(new Array<CrateData>());
    static chainValue: number = common.Configuration.baseChainValue;
    static score: KnockoutObservable<number> = ko.observable(0);
    static intensity: KnockoutObservable<number> = ko.observable(1);
    static pointThreshhold: KnockoutObservable<number> = ko.observable(common.Configuration.basePointThreshhold);
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
 * 
 * 
 * todo:
 * secret blind guardian level
 */
///<amd-dependency path="text!game/templates/Game.tmpl.html" />

import common = require('common');
import board = require('game/Board');
import ko = require('knockout');
import modals = require('game/Modals');
import status = require('game/Status');
import ability = require('game/Ability');

export class Game extends common.BaseModule {
    board: board.Board;
    modals: modals.Modals;
    lost: boolean = false;

    constructor(container: JQuery, args?: any) {
        super(container, Templates.game);
        State.game = this;
        this.board = new board.Board($('.boardContainer'));
        this.modals = new modals.Modals($('.modalsContainer'));

        var self = this;
        var restart = this.restart;
        var gameType = this.gameType;

        State.score.subscribe((score) => {
            if (score >= State.pointThreshhold()) {
                this.board.field.pause();
                State.crates([]);
                common.Configuration.increaseIntensity();

                this.board.status.abilities.forEach((ability) => ability.currentCooldown(0));
                this.modals.nextLevel(() => restart.apply(self));
            }
        });

        this.board.pause();
        this.modals.gameType(() => gameType.apply(self, arguments));
        State.cratePools = common.Configuration.getCratePools();
    }

    gameType(mode: common.GameMode): void {
        State.gameMode = mode;
        if (mode == common.GameMode.Click) {
            State.clickSpawnRate = common.Configuration.clickSpawnRate;
            State.clickSpawnCount = common.Configuration.clickSpawnCount;
        } else if (mode == common.GameMode.Timed) {

        }

        State.specialCrates.push(CrateType.rock);
        var startingAbilities = [
            new ability.AbilityData(ability.AbilityType.matchRocks, 3, 30, 10),
            new ability.AbilityData(ability.AbilityType.clearStack, 10, 0, 5),
            new ability.AbilityData(ability.AbilityType.freezeMatching, 1, 10, 30),
            new ability.AbilityData(ability.AbilityType.duplicate, 1, 10)
        ];
        for (var i = 0; i < State.abilitySlots(); i++) {
            startingAbilities.push();
        }
        State.abilities(startingAbilities);

        this.board.reset();
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
                State.clickSpawnRate = common.Configuration.clickSpawnRate;
                State.clickSpawnCount = common.Configuration.clickSpawnCount;
                State.totalSpawns = 0;
                State.cash = 0;
                State.cratePools = common.Configuration.getCratePools();
                State.specialCrates = [];
                this.board.status.resetTimer();
                State.crates([]);
                State.maxHeldCrates(common.Configuration.baseMaxHeldCrates);
                State.abilitySlots(common.Configuration.baseAbilitySlots);
                var startingAbilities = [];
                for (var i = 0; i < State.abilitySlots(); i++) {
                    startingAbilities.push(new ability.AbilityData());
                }
                State.abilities(startingAbilities);
                restart.apply(self);
             });
        }
    }

    restart() {
        this.lost = false;
        this.board.reset();
    }

    pause() {
        this.board.pause();
    }

    resume() {
        this.board.resume();
    }
}

export class State {
    static game: Game;
    static crates: KnockoutObservableArray<CrateData> = ko.observableArray(new Array<CrateData>());
    static chainValue: number = common.Configuration.baseChainValue;
    static score: KnockoutObservable<number> = ko.observable(0);
    static intensity: KnockoutObservable<number> = ko.observable(1);
    static pointThreshhold: KnockoutObservable<number> = ko.observable(common.Configuration.basePointThreshhold);
    static gameMode: common.GameMode;
    static clickSpawnRate: number;
    static clickSpawnCount: number;
    static specialCrates: number[] = [];
    static totalSpawns: number = 0;
    static cratePools: common.CratePool[];
    static cash: number = 0;
    static abilities: KnockoutObservableArray<ability.AbilityData> = ko.observableArray([]);
    static abilitySlots: KnockoutObservable<number> = ko.observable(common.Configuration.baseAbilitySlots);
    static maxHeldCrates: KnockoutObservable<number> = ko.observable(common.Configuration.baseMaxHeldCrates);
    static targetingMode: common.TargetingModes;
    static freezeMatching: boolean = false;
    static duplicateCrates: boolean = false;
    static matchRocks: boolean = false;
}

export interface CrateData {
    type: CrateType;
    count?: number;
    checked?: boolean;
    matchNumber?: number;
}

export class CrateType {
    static special = -1;
    static one = 0;
    static two = 1;
    static three = 2;
    static four = 3;
    static five = 4;

    //special
    static none = 0;
    static rock = 1; //no match, heavy
    static rainbow = 2; //matches everything
    static bonus = 3; //extra points
    static minus = 4; //less points
    static charge = 5; //charges ability on match
    static trasher = 6; //empties stack on match
    static heavy = 7; //can't be picked up
    static exploding = 8; //removes surrounding crates on match
    static activeSpawn = 9; //increases spawn rate while alive
    static matchSpawn = 10; //spawns crates when matched
    static activePenalty = 11; //all matches worth fewer points while alive
    static activeBonus = 12; //all matches worth more points while alive - also rainbow
    static scramble = 13; //fill personal stack with random crates

    
    static styles = ["one", "two", "three", "four", "five"];

    static specialTypes = [
        //CrateType.none,
        CrateType.rock,
        CrateType.rainbow,
        //CrateType.bonus,
        //CrateType.minus,
        //CrateType.charge,
        //CrateType.trasher,
        CrateType.heavy,
        //CrateType.exploding,
        //CrateType.activeSpawn,
        //CrateType.matchSpawn,
        //CrateType.activePenalty,
        //CrateType.activeBonus,
        CrateType.scramble
    ];
    static specialStyles = [
        "none",
        "rock",
        "rainbow",
        "bonus",
        "minus",
        "charge",
        "trasher",
        "heavy",
        "exploding",
        "activeSpawn",
        "matchSpawn",
        "activePenalty",
        "activeBonus",
        "scramble"
    ]

    getStyle(): string {
        var style = CrateType.styles[this.type]
        if (this.special) {
            style += " " + CrateType.specialStyles[this.special];
        }
        return style;
    }

    getSpecialStyle(): string {
        return CrateType.specialStyles[this.special];
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

    static getRandomSpecialType(): number {
        var types = [
            CrateType.rock,
            CrateType.rainbow
        ]
        return types[Math.floor(Math.random() * types.length)];
    }

    matches(c: CrateType): Boolean {
        var matches = true;

        //don't match rocks unless you have the ability
        if (!State.matchRocks) {
            matches = (this.special != CrateType.rock) && (c.special != CrateType.rock);
        }

        //match types
        matches = matches && this.type == c.type;

        //always match rainbows, even with rocks ('Match Rocks' treats rocks as rainbows, too)
        matches = matches || c.special == CrateType.rainbow || this.special == CrateType.rainbow;
        if (State.matchRocks) {
            matches = matches || c.special == CrateType.rock || this.special == CrateType.rock;
        }

        if (matches || this.special == CrateType.rock || c.special == CrateType.rock) {
            console.log("matching: ", this.type, this.special);
            console.log("with: ", c.type, c.special);
        }

        return matches;
    }

    constructor(public type: number, public special: number = 0) { }
}

module Templates {
    export var game = <string>require('text!game/templates/Game.tmpl.html');
}

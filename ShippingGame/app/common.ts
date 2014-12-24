
import ko = require('knockout');
import game = require('game/Game') ;

/*
 * modules will be given their root element.
 * On init, they use their template and root element and call this to implement their template.
*/
export function applyTemplate(target: string, data: any, template: string, bind?: boolean, prepend?: boolean);
export function applyTemplate(target: JQuery, data: any, template: string, bind?: boolean, prepend?: boolean);
export function applyTemplate(target: HTMLElement, data: any, template: string, bind?: boolean, prepend?: boolean);
export function applyTemplate(target: any, data: any, template: string, bind: boolean= true, prepend?: boolean) {
    var el;
    if (prepend) {
        el = $(target).prepend(template);
    } else {
        el = $(target).append(template);
    }
    if (bind) {
        ko.applyBindings(data, el[0]);
    }
}

export class BaseModule {
    self;

    constructor(public container: JQuery, public template:string) {
        this.self = this;
        this.render();
    }

    render() {
        applyTemplate(this.container, this, this.template);
    }
}

export class BaseRepeatingModule {
    constructor(container: JQuery, template: JQuery, prepend?: boolean);
    constructor(container: JQuery, template: string, prepend?: boolean);
    constructor(public container: JQuery, public template: any, public prepend?: boolean) {
        this.render();
    }

    render() {
        applyTemplate(this.container, this, this.template, false, this.prepend);
    }
}

export class Configuration {
    static basePointThreshhold: number = 60;
    static numStacks: number = 5;
    static stackHeight: number = 8;
    static matchAmount: number = 4;
    static baseMaxHeldCrates: number = 3;
    static rematchDelay: number = 500; // animation delay for subsequent match checking on matches
    static startDelay: number = 1000;
    static spawnInterval: number = 3500;
    static maxStackSize: number = 25;
    static baseAbilitySlots: number = 3;
    static clickSpawnRate: number = 6;
    static clickSpawnCount: number = 1;
    static baseChainValue: number = 0.5;
    static chainIncValue = (): number => 0.5;
    static getPoints = (matches: Match[]): number => {
        var crateValue = 1;
        game.State.chainValue += Configuration.chainIncValue();
        var chainValue = game.State.chainValue;
        var points = 0;

        matches.forEach((m) => {
            points += (((m.count - Configuration.matchAmount + 1) * (m.count * crateValue)) * chainValue) * game.State.intensity();
        });

        return points;
    };

    static increaseIntensity = () => {
        game.State.intensity(game.State.intensity()+1);
        game.State.pointThreshhold(game.State.pointThreshhold() + game.State.intensity() * Configuration.basePointThreshhold);
        game.State.clickSpawnRate = Configuration.clickSpawnRate - Math.floor(game.State.intensity() / 4);
        if (game.State.clickSpawnRate < 4) {
            game.State.clickSpawnCount++;
            game.State.clickSpawnRate = Configuration.clickSpawnRate - Math.floor((Math.floor(game.State.intensity() / 4) % 3));
        }
        game.State.totalSpawns = 0;
        var newSpecial = Configuration.getNewSpecialCrate();
        if (newSpecial != -1) {
            game.State.specialCrates.push(newSpecial);
        }
        game.State.cratePools = Configuration.getCratePools();
    }

    static getNewSpecialCrate(): number {
        var types = game.CrateType.specialTypes.filter((t) => (game.State.specialCrates.indexOf(t) == -1));
        if (types.length > 0) {
            return types[Math.floor(Math.random() * types.length)];
        } else {
            return -1;
        }
    }

    static getStackHeight = () => {
        return Configuration.stackHeight + Math.ceil(game.State.intensity()/2);
    }

    static getSpawnInterval = () => {
        var time = Configuration.spawnInterval - (game.State.intensity() * 100);
        if (time < 1500) return 1500;
        return time;
    }

    static getCratePools = ():CratePool[] => {
         return [{
            countdown: 3,
            baseCountdown: 3,
            getVariance: () => (Math.random() * 2) % 1,
            types: [game.CrateType.rock, game.CrateType.rainbow]
         }, {
             countdown: 4,
             baseCountdown: 4,
             getVariance: () => (Math.random() * 2) % 1,
             types: [game.CrateType.heavy, game.CrateType.scramble]
        }];
    }
}

export interface Match {
    type: game.CrateType;
    count: number;
}

export enum GameMode {
    Timed,
    Click
}

export interface CratePool {
    countdown: number;
    baseCountdown: number;
    getVariance: () => number;
    types: number[];
}

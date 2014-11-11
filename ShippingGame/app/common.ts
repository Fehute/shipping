
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
    static basePointThreshhold: number = 100;
    static numStacks: number = 5;
    static stackHeight: number = 8;
    static matchAmount: number = 4;
    static rematchDelay: number = 500; // animation delay for subsequent match checking on matches
    static startDelay: number = 1000;
    static spawnInterval: number = 3000;
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
        game.State.pointThreshhold += game.State.intensity() * Configuration.basePointThreshhold;
    }

    static getStackHeight = () => {
        return Configuration.stackHeight + Math.ceil(game.State.intensity()/2);
    }
    static getSpawnInterval = () => {
        var time = Configuration.spawnInterval - (Configuration.spawnInterval * (game.State.intensity() / 20));
        if (time < 1500) return 1500;
        return time;
    }
}

export interface Match {
    type: game.CrateType;
    count: number;
}



///<amd-dependency path="text!game/templates/Ability.tmpl.html" />

import common = require('common');
import ko = require('knockout');
import game = require('game/Game');

export class Ability extends common.BaseRepeatingModule {
    ability: JQuery;
    type: KnockoutComputed<AbilityType>;
    charges: KnockoutComputed<number>;
    cooldown: KnockoutComputed<number>;
    style: KnockoutObservable<string>;
    name: KnockoutObservable<string>;

    constructor(container: JQuery, data: AbilityData) {
        this.ability = $(Templates.ability);
        this.type = ko.computed(() => data.type());
        this.charges = ko.computed(() => data.charges());
        this.cooldown = ko.computed(() => data.cooldown());
        this.style = ko.observable(Ability.getStyle(this.type()));
        this.name = ko.observable(Ability.getName(this.type()));
        super(container, this.ability);
        ko.applyBindings(this, this.ability[0]);
    }

    setData(data: AbilityData) {
        this.type = ko.computed(() => data.type());
        this.charges = ko.computed(() => data.charges());
        this.cooldown = ko.computed(() => data.cooldown());
    }

    remove() {
        this.ability.remove();
    }

    useAbility() {
        if (this.type() == AbilityType.clearStack) {
            game.State.targetingMode = common.TargetingModes.clearStack;
        }
    }

    static styles = ["empty", "clearStack"];
    static getStyle(ability: AbilityType): string {
        return Ability.styles[ability];
    }
    static names = ["Empty", "clearStack"];
    static getName(ability: AbilityType): string {
        return Ability.styles[ability];
    }
}

export class AbilityData {
    type: KnockoutObservable<AbilityType>;
    charges: KnockoutObservable<number>;
    cooldown: KnockoutObservable<number>;

    constructor(type = AbilityType.empty, charges: number = 0, cooldown: number = 0) {
        this.type = ko.observable(type);
        this.charges = ko.observable(charges);
        this.cooldown = ko.observable(cooldown);
    }
}

export enum AbilityType {
    empty,
    clearStack
}

module Templates {
    export var ability = <string>require('text!game/templates/Ability.tmpl.html');
} 
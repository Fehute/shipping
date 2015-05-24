///<amd-dependency path="text!game/templates/Ability.tmpl.html" />

import common = require('common');
import ko = require('knockout');
import game = require('game/Game');

export class Ability extends common.BaseRepeatingModule {
    ability: JQuery;
    type: KnockoutComputed<AbilityType>;
    charges: KnockoutComputed<number>;
    cooldown: KnockoutComputed<number>;
    currentCooldown: KnockoutObservable<number>;
    style: KnockoutObservable<string>;
    name: KnockoutObservable<string>;
    onCooldown: KnockoutComputed<boolean>;
    cooldownTimer: any;
    getLabel: KnockoutComputed<string>;
    effectTimer: any;
    effectLength: KnockoutObservable<number>;
    effectCooldown: KnockoutObservable<number>;

    constructor(container: JQuery, data: AbilityData) {
        this.ability = $(Templates.ability);
        this.type = ko.computed(() => data.type());
        this.charges = ko.computed(() => data.charges());
        this.cooldown = ko.computed(() => data.cooldown());
        this.currentCooldown = ko.observable(0);
        this.style = ko.observable(Ability.getStyle(this.type()));
        this.name = ko.observable(Ability.getName(this.type()));
        this.effectLength = ko.computed(() => data.effectLength());
        this.effectCooldown = ko.observable(0);

        this.onCooldown = ko.computed(() => this.currentCooldown() > 0);
        this.getLabel = ko.computed(() => this.name() + (this.currentCooldown() ? " (" + this.currentCooldown() + "s)" : ""));

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
        if (!this.onCooldown()) {
            if (this.type() == AbilityType.clearStack) {
                game.State.targetingMode = common.TargetingModes.clearStack;
            } else if (this.type() == AbilityType.freezeMatching) {
                game.State.freezeMatching = true;
                this.setEffectDuration(() => game.State.freezeMatching = false);
            }

            this.currentCooldown(this.cooldown());
            this.cooldownTimer = setInterval(() => {
                this.currentCooldown(this.currentCooldown() - 1);
                if (this.currentCooldown() <= 0) {
                    this.currentCooldown(0);
                    clearInterval(this.cooldownTimer);
                }
            }, 1000);

        }
    }

    setEffectDuration(callback: () => void) {
        this.effectCooldown(this.effectLength());
        this.effectTimer = setInterval(() => {
            this.effectCooldown(this.effectCooldown() - 1);
            if (this.effectCooldown() <= 0) {
                this.effectCooldown(0)
                callback();
                clearInterval(this.effectTimer);
            };
        }, 1000);
    }

    static styles = ["empty", "clearStack"];
    static getStyle(ability: AbilityType): string {
        return Ability.styles[ability];
    }
    static abilityNames = ["Empty", "Clear Stack", "Freeze Matching"];
    static getName(ability: AbilityType): string {
        return Ability.abilityNames[ability];
    }
}

export class AbilityData {
    type: KnockoutObservable<AbilityType>;
    charges: KnockoutObservable<number>;
    cooldown: KnockoutObservable<number>;
    effectLength: KnockoutObservable<number>;

    constructor(type = AbilityType.empty, charges: number = 0, cooldown: number = 10, effectLength: number = 10) {
        this.type = ko.observable(type);
        this.charges = ko.observable(charges);
        this.cooldown = ko.observable(cooldown);
        this.effectLength = ko.observable(effectLength);
    }
}

export enum AbilityType {
    empty,
    clearStack,
    freezeMatching
}

module Templates {
    export var ability = <string>require('text!game/templates/Ability.tmpl.html');
} 
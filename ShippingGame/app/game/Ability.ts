///<amd-dependency path="text!game/templates/Ability.tmpl.html" />

import common = require('common');
import ko = require('knockout');
import game = require('game/Game');

export class Ability extends common.BaseRepeatingModule {
    ability: JQuery;
    type: KnockoutComputed<AbilityType>;
    charges: KnockoutObservable<number>;
    baseCharges: KnockoutComputed<number>;
    cooldown: KnockoutComputed<number>;
    currentCooldown: KnockoutObservable<number>;
    style: KnockoutObservable<string>;
    name: KnockoutObservable<string>;
    onCooldown: KnockoutComputed<boolean>;
    cooldownTimer: any;
    getLabel: KnockoutComputed<string>;
    getDurationLabel: KnockoutComputed<string>;
    effectTimer: any;
    effectLength: KnockoutObservable<number>;
    effectCooldown: KnockoutObservable<number>;

    static styles = ["empty", "clearStack", "freezeMatching", "duplicate", "matchRocks", "matchThree", "boardReset", "freezeSpawning"];
    static abilityNames = ["Empty", "Clear Stack", "Freeze Matching", "Duplicate", "Match Rocks", "matchThree", "Board Reset", "Freeze Spawns"];

    constructor(container: JQuery, data: AbilityData) {
        this.ability = $(Templates.ability);
        this.type = ko.computed(() => data.type());
        this.charges = ko.observable(data.baseCharges());
        this.baseCharges = ko.computed(() => data.baseCharges());
        this.cooldown = ko.computed(() => data.cooldown()); // total time between usages
        this.currentCooldown = ko.observable(0); // current ticking time until ability is usable
        this.style = ko.observable(Ability.getStyle(this.type()));
        this.name = ko.observable(Ability.getName(this.type()));
        this.effectLength = ko.computed(() => data.effectLength()); // duration that ability effect lasts
        this.effectCooldown = ko.observable(0); // current ticking time that the ability is in effect

        this.onCooldown = ko.computed(() => this.currentCooldown() > 0);
        this.getLabel = ko.computed(() => this.name() + (this.currentCooldown() ? " (" + this.currentCooldown() + "s)" : ""));
        this.getDurationLabel = ko.computed(() => "T: " + this.effectCooldown());

        super(container, this.ability);
        ko.applyBindings(this, this.ability[0]);
    }

    setData(data: AbilityData) {
        this.type = ko.computed(() => data.type());
        this.baseCharges = ko.computed(() => data.baseCharges());
        this.cooldown = ko.computed(() => data.cooldown());
    }

    remove() {
        this.ability.remove();
    }

    useAbility() {
        if (!this.onCooldown()) {
            if (this.baseCharges() > 0 && this.charges() > 0) {
                this.charges(this.charges() - 1);

                if (this.type() == AbilityType.clearStack) {
                    game.State.targetingMode = common.TargetingModes.clearStack;
                } else if (this.type() == AbilityType.freezeMatching) {
                    game.State.freezeMatching = true;
                    this.setEffectDuration(() => {
                        game.State.freezeMatching = false;
                        game.State.game.board.field.checkForMatch();
                    });
                } else if (this.type() == AbilityType.duplicate) {
                    game.State.duplicateCrates = true;
                    this.setEffectDuration(() => {
                        game.State.duplicateCrates = false;
                    });
                } else if (this.type() == AbilityType.matchRocks) {
                    game.State.matchRocks = true;
                    this.setEffectDuration(() => {
                        game.State.matchRocks = false;
                    });
                } else if (this.type() == AbilityType.matchThree) {
                    game.State.matchAmountAdjustment = -1;
                    game.State.game.board.field.checkForMatch();
                    this.setEffectDuration(() => {
                        game.State.matchAmountAdjustment = 0;
                    });
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

    static getStyle(ability: AbilityType): string {
        return Ability.styles[ability];
    }
    
    static getName(ability: AbilityType): string {
        return Ability.abilityNames[ability];
    }
}

export class AbilityData {
    type: KnockoutObservable<AbilityType>;
    baseCharges: KnockoutObservable<number>;
    cooldown: KnockoutObservable<number>;
    effectLength: KnockoutObservable<number>;

    constructor(type = AbilityType.empty, baseCharges: number = 0, effectLength: number = 10, cooldown: number = 10) {
        this.type = ko.observable(type);
        this.baseCharges = ko.observable(baseCharges);
        this.cooldown = ko.observable(cooldown);
        this.effectLength = ko.observable(effectLength);
    }
}

export enum AbilityType {
    empty,
    clearStack,
    freezeMatching,
    duplicate,
    matchRocks,
    matchThree,
    boardReset,
    freezeSpawning
}

module Templates {
    export var ability = <string>require('text!game/templates/Ability.tmpl.html');
} 
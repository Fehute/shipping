///<amd-dependency path="text!game/templates/Status.tmpl.html" />

import common = require('common');
import ko = require('knockout');
import game = require('game/Game');
import crate = require('game/Crate');
import ability = require('game/Ability');

export class Status extends common.BaseRepeatingModule {
    status: JQuery;
    heldCratesContainer: JQuery;
    heldCrates: crate.Crate[];
    score: KnockoutObservable<number>;
    timeElapsed: KnockoutObservable<string>;
    intensity: KnockoutObservable<number>;
    currentTime: Date;
    startTime: number;
    pointThreshhold: KnockoutObservable<number>;
    stackContents: KnockoutObservableArray<game.CrateData>;
    timer: number;
    paused: KnockoutObservable<boolean>;
    pauseLabel: KnockoutObservable<string>;
    abilitySlotsContainer: JQuery;
    abilities: ability.Ability[];


    constructor(container: JQuery, crateData?: game.CrateData) {
        this.score = game.State.score;
        this.intensity = game.State.intensity;
        this.status = $(Templates.status);
        this.pointThreshhold = game.State.pointThreshhold;
        this.stackContents = game.State.crates;
        this.heldCrates = [];
        this.heldCratesContainer = this.status.find('.heldCrates');
        this.abilitySlotsContainer = this.status.find('.abilitySlots');
        this.pauseLabel = ko.observable("Pause");
        this.paused = ko.observable(false);
        var self = this;
        var updateCrates = this.updateCrates;
        game.State.crates.subscribe(() => updateCrates.apply(self, arguments));

        var d = new Date();
        var offset = d.getTimezoneOffset();
        this.startTime = d.getTime() - offset * 60000;
        this.timeElapsed = ko.observable(this.getTime());

        this.abilities = new Array(game.State.abilitySlots());
        game.State.abilities.subscribe((val) => this.updateAbilities(val));
        this.updateAbilities(game.State.abilities());

        super(container, this.status);
        ko.applyBindings(this, this.status[0]);

        this.timer = setInterval(() => {
            this.timeElapsed(this.getTime());
        }, 1000);
    }

    getTime():string {
        var d = new Date();
        var offset = d.getTimezoneOffset();
        return new Date(d.getTime() - this.startTime).toTimeString().split(" ")[0];
    }

    stopTimer() {
        window.clearInterval(this.timer);
        this.timer = null;
    }

    resetTimer() {
        if (this.timer) this.stopTimer();
        var d = new Date();
        var offset = d.getTimezoneOffset();
        this.startTime = d.getTime() - offset * 60000;
        this.timeElapsed(this.getTime());

        this.startTimer();
    }

    startTimer() {
        if (this.timer) this.stopTimer();
        this.timer = setInterval(() => {
            this.timeElapsed(this.getTime());
        }, 1000);
    }

    updateCrates(val: game.CrateData[]) {
        this.heldCrates.forEach((c) => c.remove());
        this.heldCrates = [];

        val.forEach((cd) => this.heldCrates.push(new crate.Crate(this.heldCratesContainer, cd)));
    }

    pauseGame() {
        game.State.game.board.pause();
        this.paused(true);

        var self = this;
        game.State.game.modals.paused(() => {
            self.unpauseGame.apply(self, arguments);
        });
    }

    unpauseGame() {
        game.State.game.board.resume();
        this.paused(false);
    }

    updateAbilities(val: ability.AbilityData[]) {
        val.forEach((a, i) => {
            // add or replace abilities as necessary
            if (!this.abilities[i]) {
                this.abilities[i] = new ability.Ability(this.abilitySlotsContainer, a);
            } else if (a.type() != this.abilities[i].type()) {
                this.abilities[i].remove();
                this.abilities[i] = new ability.Ability(this.abilitySlotsContainer, a);
            }
        });
    }
}

module Templates {
    export var status = <string>require('text!game/templates/Status.tmpl.html');
} 
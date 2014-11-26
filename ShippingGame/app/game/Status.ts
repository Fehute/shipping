///<amd-dependency path="text!game/templates/Status.tmpl.html" />

import common = require('common');
import ko = require('knockout');
import game = require('game/Game');
import crate = require('game/Crate');

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
    paused: boolean;
    pauseLabel: KnockoutObservable<string>;


    constructor(container: JQuery, crateData?: game.CrateData) {
        this.score = game.State.score;
        this.intensity = game.State.intensity;
        this.status = $(Templates.status);
        this.pointThreshhold = game.State.pointThreshhold;
        this.stackContents = game.State.crates;
        this.heldCrates = [];
        this.heldCratesContainer = this.status.find('.heldCrates');
        this.pauseLabel = ko.observable("Pause");
        var self = this;
        var updateCrates = this.updateCrates;
        game.State.crates.subscribe(() => updateCrates.apply(self, arguments));

        var d = new Date();
        var offset = d.getTimezoneOffset();
        this.startTime = d.getTime() - offset * 60000;
        this.timeElapsed = ko.observable(this.getTime());

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
        if (!this.paused) {
            game.State.game.board.pause();
            this.pauseLabel("Unpause");
        } else {
            game.State.game.board.resume();
            this.pauseLabel("Pause");
        }
        this.paused = !this.paused;
    }
}

module Templates {
    export var status = <string>require('text!game/templates/Status.tmpl.html');
} 
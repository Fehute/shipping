///<amd-dependency path="text!game/templates/Status.tmpl.html" />

import common = require('common');
import ko = require('knockout');
import game = require('game/Game');

export class Status extends common.BaseRepeatingModule {
    status: JQuery;
    score: KnockoutObservable<number>;
    timeElapsed: KnockoutObservable<string>;
    intensity: KnockoutObservable<number>;
    currentTime: Date;
    startTime: number;

    constructor(container: JQuery, crateData?: game.CrateData) {
        this.score = game.State.score;
        this.intensity = game.State.intensity;
        this.status = $(Templates.status);
        this.startTime = new Date().getTime();
        this.timeElapsed = ko.observable(new Date(0).toTimeString());

        super(container, this.status);
        ko.applyBindings(this, this.status[0]);

        setInterval(() => {
            this.timeElapsed(new Date(new Date().getTime() - this.startTime).toTimeString());
        }, 1000);
    }
}

module Templates {
    export var status = <string>require('text!game/templates/Status.tmpl.html');
} 
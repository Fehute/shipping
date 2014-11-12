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

        var d = new Date();
        var offset = d.getTimezoneOffset();
        this.startTime = d.getTime() - offset * 60000;
        this.timeElapsed = ko.observable(this.getTime());

        super(container, this.status);
        ko.applyBindings(this, this.status[0]);

        setInterval(() => {
            this.timeElapsed(this.getTime());
        }, 1000);
    }

    getTime():string {
        var d = new Date();
        var offset = d.getTimezoneOffset();
        return new Date(d.getTime() - this.startTime).toTimeString().split(" ")[0];
    }
}

module Templates {
    export var status = <string>require('text!game/templates/Status.tmpl.html');
} 
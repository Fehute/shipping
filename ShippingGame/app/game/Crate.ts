///<amd-dependency path="text!game/templates/Crate.tmpl.html" />

import common = require('common');
import ko = require('knockout');
import game = require('game/Game');

export class Crate extends common.BaseRepeatingModule {
    crate: JQuery;
    crateLabel: KnockoutObservable<string>;
    type: game.CrateType;
    crateStyle;

    constructor(container: JQuery, crateData?: game.CrateData, prepend?: boolean, notType?: game.CrateType, specialType: number = game.CrateType.none) {
        this.crateLabel = ko.observable("");
        this.crate = $(Templates.crate);
        this.initData(crateData, notType, specialType);
        super(container, this.crate, prepend);
        ko.applyBindings(this, this.crate[0]);
    }

    remove(): Crate {
        this.crate.remove();
        return this;
    }

    matched() {
        //play animations and stuff
        this.crate.addClass('matched');
        setTimeout(() => this.remove(), common.Configuration.rematchDelay);
    }

    initData(data: game.CrateData, notType?: game.CrateType, special: number = game.CrateType.none) {
        if (data) {
            this.type = data.type;
        } else {
            this.type = new game.CrateType(game.CrateType.getRandomType(notType), special);
        }

        this.crateStyle = ko.observable(this.type.getStyle());
    }

    getData(): game.CrateData {
        return {
            type: this.type
        }
    }
}

module Templates {
    export var crate = <string>require('text!game/templates/Crate.tmpl.html');
} 
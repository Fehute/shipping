///<amd-dependency path="text!game/templates/Crate.tmpl.html" />

import common = require('common');
import ko = require('knockout');
import game = require('game/Game');

export class Crate extends common.BaseRepeatingModule {
    crate: JQuery;
    crateLabel: KnockoutObservable<string>;
    type: game.CrateType;
    crateStyle;

    constructor(container: JQuery, crateData?: game.CrateData) {
        this.crateLabel = ko.observable("");
        this.crate = $(Templates.crate);
        this.initData(crateData);
        super(container, this.crate);
        ko.applyBindings(this, this.crate[0]);
    }

    remove(): Crate {
        this.crate.remove();
        return this;
    }

    initData(data: game.CrateData) {
        if (data) {
            this.type = data.type;
        } else {
            this.type = new game.CrateType(game.CrateType.getRandomType());
        }

        var styles = [
            game.CrateType.one,
            game.CrateType.two,
            game.CrateType.three,
            game.CrateType.four,
            game.CrateType.five
        ];
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
///<amd-dependency path="text!game/templates/Crate.tmpl.html" />

import common = require('common');
import ko = require('knockout');

export class Crate extends common.BaseRepeatingModule {
    crate: JQuery;
    crateLabel: KnockoutObservable<string>;

    constructor(container: JQuery) {
        this.crateLabel = ko.observable("SuperCrate");
        this.crate = $(Templates.crate);
        super(container, this.crate);
        ko.applyBindings(this, this.crate[0]);
    }
}

module Templates {
    export var crate = <string>require('text!game/templates/Crate.tmpl.html');
} 
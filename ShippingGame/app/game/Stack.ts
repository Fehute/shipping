///<amd-dependency path="text!game/templates/Stack.tmpl.html" />

import common = require('common');
import ko = require('knockout');
import crate = require('game/Crate');

export class Stack extends common.BaseRepeatingModule {
    stack: JQuery;
    crates: KnockoutObservableArray<crate.Crate>;

    constructor(container: JQuery) {
        this.stack = $(Templates.stack);
        super(container, this.stack);
        ko.applyBindings(this, this.stack[0]);
        this.crates = ko.observableArray(this.generateStartingCrates());
    }

    generateStartingCrates(): crate.Crate[] {
        var crates = [];
        for (var i = 0; i < common.Configuration.numStacks; i++) {
            crates.push(new crate.Crate($('.crateContainer')));
        }
        return crates;
    }
}

module Templates {
    export var stack = <string>require('text!game/templates/Stack.tmpl.html');
} 
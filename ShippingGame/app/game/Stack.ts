///<amd-dependency path="text!game/templates/Stack.tmpl.html" />

import common = require('common');
import ko = require('knockout');
import crate = require('game/Crate');
import input = require('Input');
import game = require('game/Game');

export class Stack extends common.BaseRepeatingModule {
    stack: JQuery;
    crates: KnockoutObservableArray<crate.Crate>;
    crateContainer: JQuery;

    constructor(container: JQuery) {
        this.stack = $(Templates.stack);
        this.crateContainer = $('.crateContainer', this.stack);
        super(container, this.stack);
        ko.applyBindings(this, this.stack[0]);
        this.crates = ko.observableArray(this.generateStartingCrates());

        var self = this;
        input.grab(this.stack, () => this.grab.apply(self, arguments));
        input.release(this.stack, () => this.release.apply(self, arguments));
    }

    generateStartingCrates(): crate.Crate[] {
        var crates = [];
        for (var i = 0; i < common.Configuration.stackHeight; i++) {
            crates.push(new crate.Crate(this.crateContainer));
        }
        return crates;
    }

    grab() {
        var crate = this.popCrate();
        game.State.crate = crate.getData();
    }

    release() {
        if (game.State.crate) {
            this.crates.push(new crate.Crate(this.crateContainer, game.State.crate));
            game.State.crate = null;
        }
    }

    popCrate(): crate.Crate {
        return this.crates.pop().remove();
    }

    
}

module Templates {
    export var stack = <string>require('text!game/templates/Stack.tmpl.html');
} 

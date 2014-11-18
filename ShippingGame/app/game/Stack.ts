///<amd-dependency path="text!game/templates/Stack.tmpl.html" />

import common = require('common');
import ko = require('knockout');
import crate = require('game/Crate');
import input = require('Input');
import game = require('game/Game');
import field = require('game/Field');

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
        this.crates.subscribe(this.checkForLoss);

        var self = this;
        input.grab(this.stack, () => this.grab.apply(self, arguments));
        input.release(this.stack, () => this.release.apply(self, arguments));
    }

    spawnCrate() {
        this.crates([new crate.Crate(this.crateContainer, null, true, this.getFirstCrateType())].concat(this.crates()));
    }

    getFirstCrateType(cratesToCheck?: crate.Crate[]): game.CrateType {
        cratesToCheck = cratesToCheck || this.crates();
        if (cratesToCheck.length) {
            return cratesToCheck[0].type;
        }
        return null;
    }

    generateStartingCrates(): crate.Crate[] {
        var crates = [];
        for (var i = 0; i < common.Configuration.getStackHeight(); i++) {
            crates.push(new crate.Crate(this.crateContainer, null, false, this.getFirstCrateType(crates.slice().reverse())));
        }
        return crates;
    }

    resetTo(numCrates: number) {
        numCrates = numCrates || common.Configuration.getStackHeight();

        this.crates().forEach((c) => c.remove());
        this.crates(this.generateStartingCrates());
    }

    grab() {
        var crate = this.popCrate();
        game.State.chainValue = common.Configuration.baseChainValue;
        game.State.crates.push(crate.getData());
        field.Field.crateTouched();
    }

    release() {
        if (game.State.crates().length) {
            this.crates.push(new crate.Crate(this.crateContainer, game.State.crates.pop()));
            field.Field.cratePlaced();
            field.Field.crateTouched();
        }
    }

    popCrate(): crate.Crate {
        return this.crates.pop().remove();
    }

    //field will tell us which crates in the stack to set as matched
    matchCrates(indicies: number[]) {
        var indexOf;
        this.crates(this.crates().filter((val, i) => {
            indexOf = indicies.indexOf(i);
            if (indexOf == null || indexOf == -1) { //only keep non-matched crates
                return true;
            } else { //tell crates to do their thing, then remove them from array
                val.matched();
                return false;
            }
         }));
    }

    getContents(): game.CrateData[] {
        return this.crates().map((val) => val.getData());
    }

    checkForLoss(crates) {
        if (crates.length > common.Configuration.maxStackSize) {
            game.State.game.gameLost();
        }
    }
    
}

module Templates {
    export var stack = <string>require('text!game/templates/Stack.tmpl.html');
} 

﻿///<amd-dependency path="text!game/templates/Field.tmpl.html" />

import common = require('common');
import stack = require('game/Stack');
import ko = require('knockout');
import game = require('game/Game');

export class Field extends common.BaseModule {
    stacks: KnockoutObservableArray<stack.Stack>;
    static cratePlaced: () => void;
    spawner: number;

    constructor(container: JQuery) {
        super(container, Templates.field);
        this.stacks = ko.observableArray(this.generateStartingStacks());
        Field.cratePlaced = () => this.checkForMatch.apply(this, arguments);

        var self = this;
        setTimeout(() => this.start.apply(self, arguments), common.Configuration.startDelay);
    }

    start() {
        var self = this;
        this.spawner = setInterval(() => this.spawnCrates.apply(self, arguments), common.Configuration.getSpawnInterval());
        this.checkForMatch();
    }

    spawnCrates() {
        this.stacks().forEach((stack) => stack.spawnCrate());
        this.checkForMatch();
    }

    generateStartingStacks(): stack.Stack[]{
        var stacks = [];
        for (var i = 0; i < common.Configuration.numStacks; i++) {
            stacks.push(new stack.Stack($('.stackContainer')));
        }
        return stacks;
    }

    reset() {
        window.clearInterval(this.spawner);
        this.stacks().forEach((stack) => stack.resetTo(common.Configuration.getStackHeight()));
        this.start();
    }

    checkForMatch() {
        //request an array from each stack
        //make array of these arrays (now we have the grid)
        //search for one color at a time. 

        //stack x crate array of CrateData
        var field: game.CrateData[][] = this.stacks().map((val) => val.getContents());

        var hitEnd = false;
        var crate: game.CrateData;
        var type: game.CrateType;
        var count: number = 0;
        var matchNumber = 1;
        //check every space in the board for a match. This is for finding initial crates' types to check
        for (var x = 0; x < field.length; x++) {
            //travel across our board
            for (var y = 0; y < field[x].length; y++) {
                //travel down our stack
                crate = field[x][y];
                if (!crate.checked) { //new crate
                    //begin checking for a new set
                    crate.checked = true;
                    type = crate.type;
                    count = 1;
                    crate.matchNumber = ++matchNumber; //unique, true-like match number

                    var compareCrates = (x, y, crate): game.CrateData[] => {
                        var crate2: game.CrateData;
                        if ((x >= 0 && x < field.length) && (y >= 0 && y < field[x].length)) {
                            crate2 = field[x][y];
                            if (!crate2.checked && (crate2.type.matches(crate.type))) {
                                crate2.checked = true;
                                crate2.matchNumber = matchNumber;
                                count++;

                                var subMatch: game.CrateData[] = [crate2];
                                subMatch = subMatch.concat(compareCrates(x + 1, y, crate2));
                                subMatch = subMatch.concat(compareCrates(x, y + 1, crate2));
                                subMatch = subMatch.concat(compareCrates(x - 1, y, crate2));
                                subMatch = subMatch.concat(compareCrates(x, y - 1, crate2));
                                return subMatch;
                            }
                        }
                        return null;
                    }

                    var match = [crate];
                    match = match.concat(compareCrates(x + 1, y, crate));
                    match = match.concat(compareCrates(x, y + 1, crate));
                    match = match.concat(compareCrates(x - 1, y, crate));
                    match = match.concat(compareCrates(x, y - 1, crate));
                    match = match = match.filter((val) => val != null);
                    match.forEach((val) => val.count = count);

                } else { //already a known match, skip it
                    continue;
                }
            }
        }

        

        //turn the field into sets of crate indicies that were successfully matched
        var matchResults: number[][] = field.map((stack) => stack.map((c, i) => c.count >= common.Configuration.matchAmount ? i : -1).filter((val) => val != -1));

        //now tell each stack
        this.stacks().forEach((stack, i) => stack.matchCrates(matchResults[i]));


        /*
         * field is CrateData[][]
         * Start by combining into one array
         * Filter by matched elements
         * Reduce to the highest count per matchId
         */
        var crates = field.reduce((p: game.CrateData[], c: game.CrateData[]) => { return p.concat(c) }, []);
        crates = crates.filter((c) => c.count >= common.Configuration.matchAmount);
        crates = crates.reduce((p: game.CrateData[], c: game.CrateData) => { if (!p.some((o) => o.matchNumber == c.matchNumber)) { return p.concat(c) } return p }, []).filter((c) => c != null);
        var score = common.Configuration.getPoints(crates.map((c): common.Match => c));
        game.State.score(game.State.score() + score);



        var checkAgain = 0;
        matchResults.forEach((stack) => checkAgain += stack.length);
        if (checkAgain) {
            setTimeout(() => this.checkForMatch(), common.Configuration.rematchDelay);
        }
    }
}

module Templates {
    export var field = <string>require('text!game/templates/Field.tmpl.html');
} 
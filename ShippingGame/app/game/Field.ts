///<amd-dependency path="text!game/templates/Field.tmpl.html" />

import common = require('common');
import stack = require('game/Stack');
import ko = require('knockout');
import game = require('game/Game');

export class Field extends common.BaseModule {
    stacks: KnockoutObservableArray<stack.Stack>;
    static cratePlaced: () => void;
    static crateTouched: () => void;
    spawner: number;
    numClicks = ko.observable(0);

    constructor(container: JQuery) {
        super(container, Templates.field);
        this.stacks = ko.observableArray(this.generateStartingStacks());
        Field.cratePlaced = () => this.checkForMatch.apply(this, arguments);
        Field.crateTouched = () => this.crateTouched.apply(this, arguments);
    }

    start() {
        if (!game.State.gameMode || game.State.gameMode == common.GameMode.Timed) {
            var self = this;
            this.spawner = setInterval(() => this.spawnCrates.apply(self, arguments), common.Configuration.getSpawnInterval());
            this.checkForMatch();
        } else if (game.State.gameMode == common.GameMode.Click) {
            this.numClicks = ko.observable(0);
            this.numClicks.subscribe((val) => {
                if (val >= game.State.clickSpawnRate) {
                    for (var i = 0; i < game.State.clickSpawnCount; i++) {
                        this.spawnCrates();
                    }
                    this.numClicks(0);
                }
            });
            this.checkForMatch();
        }
    }

    crateTouched() {
        this.numClicks(this.numClicks() + 1);
    }

    spawnCrates() {
        game.State.totalSpawns++;
        var specials = this.getSpecialSpawns();
        this.stacks().forEach((stack, i) => {
            stack.spawnCrate(specials[i]);
        });
        this.checkForMatch();
    }

    getSpecialSpawns(): number[]{
        var none = game.CrateType.none;
        var availableTypes: number[];
        var spawns = [];
        for (var i = 0; i < common.Configuration.numStacks; i++) {
            spawns.push(none);
        }

        game.State.cratePools.forEach((p) => {
            p.countdown--;
            if (p.countdown <= 0) {
                p.countdown = p.baseCountdown - p.getVariance();
                availableTypes = p.types.filter((t) => game.State.specialCrates.indexOf(t) != -1);
                if (availableTypes.length > 0) {
                    spawns[Math.floor(Math.random() * spawns.length)] = availableTypes[Math.floor(Math.random() * availableTypes.length)];
                }
            }

        });

        return spawns;
    }

    generateStartingStacks(): stack.Stack[] {
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

    pause() {
        window.clearInterval(this.spawner);
    }

    resume() {
        this.start();
    }

    checkForMatch() {
        //request an array from each stack
        //make array of these arrays (now we have the grid)
        //search for one color at a time. 

        if (game.State.freezeMatching) return;

        //stack x crate array of CrateData
        var field: game.CrateData[][] = this.stacks().map((val) => val.getContents());

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
                if (!crate.checked && crate.type.special != game.CrateType.rainbow && (!game.State.matchRocks || (crate.type.special != game.CrateType.rock))) { //new crate
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
                                crate2.checked = crate2.type.special != game.CrateType.rainbow && (!game.State.matchRocks || (crate2.type.special != game.CrateType.rock));
                                crate2.matchNumber = matchNumber;
                                count++;

                                var subMatch: game.CrateData[] = [crate2];
                                subMatch = subMatch.concat(compareCrates(x + 1, y, crate));
                                subMatch = subMatch.concat(compareCrates(x, y + 1, crate));
                                subMatch = subMatch.concat(compareCrates(x - 1, y, crate));
                                subMatch = subMatch.concat(compareCrates(x, y - 1, crate));
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
        var matchResults: number[][] = field.map((stack) => stack.map((c, i) => c.count >= (common.Configuration.matchAmount + game.State.matchAmountAdjustment) ? i : -1).filter((val) => val != -1));

        //now tell each stack
        this.stacks().forEach((stack, i) => stack.matchCrates(matchResults[i]));


        /*
         * field is CrateData[][]
         * Start by combining into one array
         * Filter by matched elements
         * Reduce to the highest count per matchId
         */
        var crates = field.reduce((p: game.CrateData[], c: game.CrateData[]) => { return p.concat(c) }, []);
        crates = crates.filter((c) => c.count >= (common.Configuration.matchAmount + game.State.matchAmountAdjustment));
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
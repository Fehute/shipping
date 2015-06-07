///<amd-dependency path="text!game/templates/Field.tmpl.html" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'common', 'game/Stack', 'knockout', 'game/Game', "text!game/templates/Field.tmpl.html"], function(require, exports, common, stack, ko, game) {
    var Field = (function (_super) {
        __extends(Field, _super);
        function Field(container) {
            var _this = this;
            _super.call(this, container, Templates.field);
            this.numClicks = ko.observable(0);
            this.stacks = ko.observableArray(this.generateStartingStacks());
            Field.cratePlaced = function () {
                return _this.checkForMatch.apply(_this, arguments);
            };
            Field.crateTouched = function () {
                return _this.crateTouched.apply(_this, arguments);
            };
        }
        Field.prototype.start = function () {
            var _this = this;
            if (!game.State.gameMode || game.State.gameMode == 0 /* Timed */) {
                var self = this;
                this.spawner = setInterval(function () {
                    return _this.spawnCrates.apply(self, arguments);
                }, common.Configuration.getSpawnInterval());
                this.checkForMatch();
            } else if (game.State.gameMode == 1 /* Click */) {
                this.numClicks = ko.observable(0);
                this.numClicks.subscribe(function (val) {
                    if (val >= game.State.clickSpawnRate) {
                        for (var i = 0; i < game.State.clickSpawnCount; i++) {
                            _this.spawnCrates();
                        }
                        _this.numClicks(0);
                    }
                });
                this.checkForMatch();
            }
        };

        Field.prototype.crateTouched = function () {
            this.numClicks(this.numClicks() + 1);
        };

        Field.prototype.spawnCrates = function () {
            game.State.totalSpawns++;
            var specials = this.getSpecialSpawns();
            this.stacks().forEach(function (stack, i) {
                stack.spawnCrate(specials[i]);
            });
            this.checkForMatch();
        };

        Field.prototype.getSpecialSpawns = function () {
            var none = game.CrateType.none;
            var availableTypes;
            var spawns = [];
            for (var i = 0; i < common.Configuration.numStacks; i++) {
                spawns.push(none);
            }

            game.State.cratePools.forEach(function (p) {
                p.countdown--;
                if (p.countdown <= 0) {
                    p.countdown = p.baseCountdown - p.getVariance();
                    availableTypes = p.types.filter(function (t) {
                        return game.State.specialCrates.indexOf(t) != -1;
                    });
                    if (availableTypes.length > 0) {
                        spawns[Math.floor(Math.random() * spawns.length)] = availableTypes[Math.floor(Math.random() * availableTypes.length)];
                    }
                }
            });

            return spawns;
        };

        Field.prototype.generateStartingStacks = function () {
            var stacks = [];
            for (var i = 0; i < common.Configuration.numStacks; i++) {
                stacks.push(new stack.Stack($('.stackContainer')));
            }
            return stacks;
        };

        Field.prototype.reset = function () {
            window.clearInterval(this.spawner);
            this.stacks().forEach(function (stack) {
                return stack.resetTo(common.Configuration.getStackHeight());
            });
            this.start();
        };

        Field.prototype.pause = function () {
            window.clearInterval(this.spawner);
        };

        Field.prototype.resume = function () {
            this.start();
        };

        Field.prototype.checkForMatch = function () {
            //request an array from each stack
            //make array of these arrays (now we have the grid)
            //search for one color at a time.
            var _this = this;
            if (game.State.freezeMatching)
                return;

            //stack x crate array of CrateData
            var field = this.stacks().map(function (val) {
                return val.getContents();
            });

            var crate;
            var type;
            var count = 0;
            var matchNumber = 1;

            for (var x = 0; x < field.length; x++) {
                for (var y = 0; y < field[x].length; y++) {
                    //travel down our stack
                    crate = field[x][y];
                    if (!crate.checked && crate.type.special != game.CrateType.rainbow && (!game.State.matchRocks || (crate.type.special != game.CrateType.rock))) {
                        //begin checking for a new set
                        crate.checked = true;
                        type = crate.type;
                        count = 1;
                        crate.matchNumber = ++matchNumber; //unique, true-like match number

                        var compareCrates = function (x, y, crate) {
                            var crate2;
                            if ((x >= 0 && x < field.length) && (y >= 0 && y < field[x].length)) {
                                crate2 = field[x][y];
                                if (!crate2.checked && (crate2.type.matches(crate.type))) {
                                    crate2.checked = crate2.type.special != game.CrateType.rainbow && (!game.State.matchRocks || (crate2.type.special != game.CrateType.rock));
                                    crate2.matchNumber = matchNumber;
                                    count++;

                                    var subMatch = [crate2];
                                    subMatch = subMatch.concat(compareCrates(x + 1, y, crate));
                                    subMatch = subMatch.concat(compareCrates(x, y + 1, crate));
                                    subMatch = subMatch.concat(compareCrates(x - 1, y, crate));
                                    subMatch = subMatch.concat(compareCrates(x, y - 1, crate));
                                    return subMatch;
                                }
                            }
                            return null;
                        };

                        var match = [crate];
                        match = match.concat(compareCrates(x + 1, y, crate));
                        match = match.concat(compareCrates(x, y + 1, crate));
                        match = match.concat(compareCrates(x - 1, y, crate));
                        match = match.concat(compareCrates(x, y - 1, crate));
                        match = match = match.filter(function (val) {
                            return val != null;
                        });
                        match.forEach(function (val) {
                            return val.count = count;
                        });
                    } else {
                        continue;
                    }
                }
            }

            //turn the field into sets of crate indicies that were successfully matched
            var matchResults = field.map(function (stack) {
                return stack.map(function (c, i) {
                    return c.count >= common.Configuration.matchAmount ? i : -1;
                }).filter(function (val) {
                    return val != -1;
                });
            });

            //now tell each stack
            this.stacks().forEach(function (stack, i) {
                return stack.matchCrates(matchResults[i]);
            });

            /*
            * field is CrateData[][]
            * Start by combining into one array
            * Filter by matched elements
            * Reduce to the highest count per matchId
            */
            var crates = field.reduce(function (p, c) {
                return p.concat(c);
            }, []);
            crates = crates.filter(function (c) {
                return c.count >= common.Configuration.matchAmount;
            });
            crates = crates.reduce(function (p, c) {
                if (!p.some(function (o) {
                    return o.matchNumber == c.matchNumber;
                })) {
                    return p.concat(c);
                }
                return p;
            }, []).filter(function (c) {
                return c != null;
            });
            var score = common.Configuration.getPoints(crates.map(function (c) {
                return c;
            }));
            game.State.score(game.State.score() + score);

            var checkAgain = 0;
            matchResults.forEach(function (stack) {
                return checkAgain += stack.length;
            });
            if (checkAgain) {
                setTimeout(function () {
                    return _this.checkForMatch();
                }, common.Configuration.rematchDelay);
            }
        };
        return Field;
    })(common.BaseModule);
    exports.Field = Field;

    var Templates;
    (function (Templates) {
        Templates.field = require('text!game/templates/Field.tmpl.html');
    })(Templates || (Templates = {}));
});
//# sourceMappingURL=Field.js.map

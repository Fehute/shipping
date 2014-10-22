///<amd-dependency path="text!game/templates/Field.tmpl.html" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'common', 'game/Stack', 'knockout', "text!game/templates/Field.tmpl.html"], function(require, exports, common, stack, ko) {
    var Field = (function (_super) {
        __extends(Field, _super);
        function Field(container) {
            var _this = this;
            _super.call(this, container, Templates.field);
            this.stacks = ko.observableArray(this.generateStartingStacks());
            Field.cratePlaced = function () {
                return _this.checkForMatch.apply(_this, arguments);
            };

            var self = this;
            setTimeout(function () {
                return _this.start.apply(self, arguments);
            }, common.Configuration.startDelay);
        }
        Field.prototype.start = function () {
            var _this = this;
            var self = this;
            this.spawner = setInterval(function () {
                return _this.spawnCrates.apply(self, arguments);
            }, common.Configuration.spawnInterval);
            this.checkForMatch();
        };

        Field.prototype.spawnCrates = function () {
            this.stacks().forEach(function (stack) {
                return stack.spawnCrate();
            });
            this.checkForMatch();
        };

        Field.prototype.generateStartingStacks = function () {
            var stacks = [];
            for (var i = 0; i < common.Configuration.numStacks; i++) {
                stacks.push(new stack.Stack($('.stackContainer')));
            }
            return stacks;
        };

        Field.prototype.checkForMatch = function () {
            //request an array from each stack
            //make array of these arrays (now we have the grid)
            //search for one color at a time.
            var _this = this;
            //stack x crate array of CrateData
            var field = this.stacks().map(function (val) {
                return val.getContents();
            });

            var hitEnd = false;
            var crate;
            var type;
            var count = 0;
            var matchNumber = 1;

            for (var x = 0; x < field.length; x++) {
                for (var y = 0; y < field[x].length; y++) {
                    //travel down our stack
                    crate = field[x][y];
                    if (!crate.checked) {
                        //begin checking for a new set
                        crate.checked = true;
                        type = crate.type;
                        count = 1;
                        crate.matchNumber = matchNumber++; //unique, true-like match number

                        var compareCrates = function (x, y, crate) {
                            var crate2;
                            if ((x >= 0 && x < field.length) && (y >= 0 && y < field[x].length)) {
                                crate2 = field[x][y];
                                if (!crate2.checked && (crate2.type.matches(crate.type))) {
                                    crate2.checked = true;
                                    crate2.matchNumber = matchNumber;
                                    count++;

                                    var subMatch = [crate2];
                                    subMatch = subMatch.concat(compareCrates(x + 1, y, crate2));
                                    subMatch = subMatch.concat(compareCrates(x, y + 1, crate2));
                                    subMatch = subMatch.concat(compareCrates(x - 1, y, crate2));
                                    subMatch = subMatch.concat(compareCrates(x, y - 1, crate2));
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

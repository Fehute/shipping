///<amd-dependency path="text!game/templates/Stack.tmpl.html" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'common', 'knockout', 'game/Crate', 'Input', 'game/Game', 'game/Field', "text!game/templates/Stack.tmpl.html"], function(require, exports, common, ko, crate, input, game, field) {
    var Stack = (function (_super) {
        __extends(Stack, _super);
        function Stack(container) {
            var _this = this;
            this.stack = $(Templates.stack);
            this.crateContainer = $('.crateContainer', this.stack);
            _super.call(this, container, this.stack);
            ko.applyBindings(this, this.stack[0]);
            this.crates = ko.observableArray(this.generateStartingCrates());
            this.crates.subscribe(this.checkForLoss);

            var self = this;
            input.grab(this.stack, function () {
                return _this.grab.apply(self, arguments);
            });
            input.release(this.stack, function () {
                return _this.release.apply(self, arguments);
            });
        }
        Stack.prototype.spawnCrate = function (specialType) {
            if (typeof specialType === "undefined") { specialType = game.CrateType.none; }
            this.crates([new crate.Crate(this.crateContainer, null, true, this.getFirstCrateType(), specialType)].concat(this.crates()));
        };

        Stack.prototype.getFirstCrateType = function (cratesToCheck) {
            cratesToCheck = cratesToCheck || this.crates();
            if (cratesToCheck.length) {
                return cratesToCheck[0].type;
            }
            return null;
        };

        Stack.prototype.generateStartingCrates = function () {
            var crates = [];
            for (var i = 0; i < common.Configuration.getStackHeight(); i++) {
                crates.push(new crate.Crate(this.crateContainer, null, false, this.getFirstCrateType(crates.slice().reverse())));
            }
            return crates;
        };

        Stack.prototype.resetTo = function (numCrates) {
            numCrates = numCrates || common.Configuration.getStackHeight();

            this.crates().forEach(function (c) {
                return c.remove();
            });
            this.crates(this.generateStartingCrates());
        };

        Stack.prototype.grab = function (e, targetingMode) {
            if (!targetingMode || targetingMode == 0 /* normal */) {
                if (this.crates().length > 0) {
                    var topCrateType = this.crates.slice(-1)[0].type;
                    if (topCrateType.special == game.CrateType.rock) {
                        return;
                    } else if (topCrateType.special == game.CrateType.heavy) {
                        return;
                    }
                    var crate = this.popCrate();
                    game.State.chainValue = common.Configuration.baseChainValue;
                    game.State.crates.push(crate.getData());
                    field.Field.crateTouched();
                }
            } else if (targetingMode == 1 /* clearStack */) {
                this.crates().forEach(function (crate) {
                    return crate.remove();
                });
                this.crates([]);
                game.State.targetingMode = 0 /* normal */;
            }
        };

        Stack.prototype.release = function () {
            if (game.State.crates().length) {
                this.crates.push(new crate.Crate(this.crateContainer, game.State.crates.pop()));
                field.Field.cratePlaced();
                field.Field.crateTouched();
            }
        };

        Stack.prototype.popCrate = function () {
            return this.crates.pop().remove();
        };

        //field will tell us which crates in the stack to set as matched
        Stack.prototype.matchCrates = function (indicies) {
            var indexOf;
            this.crates(this.crates().filter(function (val, i) {
                indexOf = indicies.indexOf(i);
                if (indexOf == null || indexOf == -1) {
                    return true;
                } else {
                    val.matched();
                    return false;
                }
            }));
        };

        Stack.prototype.getContents = function () {
            return this.crates().map(function (val) {
                return val.getData();
            });
        };

        Stack.prototype.checkForLoss = function (crates) {
            if (crates.length > common.Configuration.maxStackSize) {
                game.State.game.gameLost();
            }
        };
        return Stack;
    })(common.BaseRepeatingModule);
    exports.Stack = Stack;

    var Templates;
    (function (Templates) {
        Templates.stack = require('text!game/templates/Stack.tmpl.html');
    })(Templates || (Templates = {}));
});
//# sourceMappingURL=Stack.js.map

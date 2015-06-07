///<amd-dependency path="text!game/templates/Ability.tmpl.html" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'common', 'knockout', 'game/Game', "text!game/templates/Ability.tmpl.html"], function(require, exports, common, ko, game) {
    var Ability = (function (_super) {
        __extends(Ability, _super);
        function Ability(container, data) {
            var _this = this;
            this.ability = $(Templates.ability);
            this.type = ko.computed(function () {
                return data.type();
            });
            this.charges = ko.observable(data.baseCharges());
            this.baseCharges = ko.computed(function () {
                return data.baseCharges();
            });
            this.cooldown = ko.computed(function () {
                return data.cooldown();
            }); // total time between usages
            this.currentCooldown = ko.observable(0); // current ticking time until ability is usable
            this.style = ko.observable(Ability.getStyle(this.type()));
            this.name = ko.observable(Ability.getName(this.type()));
            this.effectLength = ko.computed(function () {
                return data.effectLength();
            }); // duration that ability effect lasts
            this.effectCooldown = ko.observable(0); // current ticking time that the ability is in effect

            this.onCooldown = ko.computed(function () {
                return _this.currentCooldown() > 0;
            });
            this.getLabel = ko.computed(function () {
                return _this.name() + (_this.currentCooldown() ? " (" + _this.currentCooldown() + "s)" : "");
            });
            this.getDurationLabel = ko.computed(function () {
                return "T: " + _this.effectCooldown();
            });

            _super.call(this, container, this.ability);
            ko.applyBindings(this, this.ability[0]);
        }
        Ability.prototype.setData = function (data) {
            this.type = ko.computed(function () {
                return data.type();
            });
            this.baseCharges = ko.computed(function () {
                return data.baseCharges();
            });
            this.cooldown = ko.computed(function () {
                return data.cooldown();
            });
        };

        Ability.prototype.remove = function () {
            this.ability.remove();
        };

        Ability.prototype.useAbility = function () {
            var _this = this;
            if (!this.onCooldown()) {
                if (this.baseCharges() > 0 && this.charges() > 0) {
                    this.charges(this.charges() - 1);

                    if (this.type() == 1 /* clearStack */) {
                        game.State.targetingMode = 1 /* clearStack */;
                    } else if (this.type() == 2 /* freezeMatching */) {
                        game.State.freezeMatching = true;
                        this.setEffectDuration(function () {
                            game.State.freezeMatching = false;
                            game.State.game.board.field.checkForMatch();
                        });
                    } else if (this.type() == 3 /* duplicate */) {
                        game.State.duplicateCrates = true;
                        this.setEffectDuration(function () {
                            game.State.duplicateCrates = false;
                        });
                    } else if (this.type() == 4 /* matchRocks */) {
                        game.State.matchRocks = true;
                        this.setEffectDuration(function () {
                            game.State.matchRocks = false;
                        });
                    }

                    this.currentCooldown(this.cooldown());
                    this.cooldownTimer = setInterval(function () {
                        _this.currentCooldown(_this.currentCooldown() - 1);
                        if (_this.currentCooldown() <= 0) {
                            _this.currentCooldown(0);
                            clearInterval(_this.cooldownTimer);
                        }
                    }, 1000);
                }
            }
        };

        Ability.prototype.setEffectDuration = function (callback) {
            var _this = this;
            this.effectCooldown(this.effectLength());
            this.effectTimer = setInterval(function () {
                _this.effectCooldown(_this.effectCooldown() - 1);
                if (_this.effectCooldown() <= 0) {
                    _this.effectCooldown(0);
                    callback();
                    clearInterval(_this.effectTimer);
                }
                ;
            }, 1000);
        };

        Ability.getStyle = function (ability) {
            return Ability.styles[ability];
        };

        Ability.getName = function (ability) {
            return Ability.abilityNames[ability];
        };
        Ability.styles = ["empty", "clearStack", "freezeMatching", "duplicate", "matchRocks", "matchThree", "boardReset", "freezeSpawning"];
        Ability.abilityNames = ["Empty", "Clear Stack", "Freeze Matching", "Duplicate", "Match Rocks", "matchThree", "Board Reset", "Freeze Spawns"];
        return Ability;
    })(common.BaseRepeatingModule);
    exports.Ability = Ability;

    var AbilityData = (function () {
        function AbilityData(type, baseCharges, effectLength, cooldown) {
            if (typeof type === "undefined") { type = 0 /* empty */; }
            if (typeof baseCharges === "undefined") { baseCharges = 0; }
            if (typeof effectLength === "undefined") { effectLength = 10; }
            if (typeof cooldown === "undefined") { cooldown = 10; }
            this.type = ko.observable(type);
            this.baseCharges = ko.observable(baseCharges);
            this.cooldown = ko.observable(cooldown);
            this.effectLength = ko.observable(effectLength);
        }
        return AbilityData;
    })();
    exports.AbilityData = AbilityData;

    (function (AbilityType) {
        AbilityType[AbilityType["empty"] = 0] = "empty";
        AbilityType[AbilityType["clearStack"] = 1] = "clearStack";
        AbilityType[AbilityType["freezeMatching"] = 2] = "freezeMatching";
        AbilityType[AbilityType["duplicate"] = 3] = "duplicate";
        AbilityType[AbilityType["matchRocks"] = 4] = "matchRocks";
        AbilityType[AbilityType["matchThree"] = 5] = "matchThree";
        AbilityType[AbilityType["boardReset"] = 6] = "boardReset";
        AbilityType[AbilityType["freezeSpawning"] = 7] = "freezeSpawning";
    })(exports.AbilityType || (exports.AbilityType = {}));
    var AbilityType = exports.AbilityType;

    var Templates;
    (function (Templates) {
        Templates.ability = require('text!game/templates/Ability.tmpl.html');
    })(Templates || (Templates = {}));
});
//# sourceMappingURL=Ability.js.map

define(["require", "exports", 'knockout', 'game/Game'], function(require, exports, ko, game) {
    

    function applyTemplate(target, data, template, bind, prepend) {
        if (typeof bind === "undefined") { bind = true; }
        var el;
        if (prepend) {
            el = $(target).prepend(template);
        } else {
            el = $(target).append(template);
        }
        if (bind) {
            ko.applyBindings(data, el[0]);
        }
    }
    exports.applyTemplate = applyTemplate;

    var BaseModule = (function () {
        function BaseModule(container, template) {
            this.container = container;
            this.template = template;
            this.self = this;
            this.render();
        }
        BaseModule.prototype.render = function () {
            exports.applyTemplate(this.container, this, this.template);
        };
        return BaseModule;
    })();
    exports.BaseModule = BaseModule;

    var BaseRepeatingModule = (function () {
        function BaseRepeatingModule(container, template, prepend) {
            this.container = container;
            this.template = template;
            this.prepend = prepend;
            this.render();
        }
        BaseRepeatingModule.prototype.render = function () {
            exports.applyTemplate(this.container, this, this.template, false, this.prepend);
        };
        return BaseRepeatingModule;
    })();
    exports.BaseRepeatingModule = BaseRepeatingModule;

    var Configuration = (function () {
        function Configuration() {
        }
        Configuration.getNewSpecialCrate = function () {
            var types = game.CrateType.specialTypes.filter(function (t) {
                return (game.State.specialCrates.indexOf(t) == -1);
            });
            if (types.length > 0) {
                return types[Math.floor(Math.random() * types.length)];
            } else {
                return -1;
            }
        };
        Configuration.basePointThreshhold = 60;
        Configuration.numStacks = 5;
        Configuration.stackHeight = 8;
        Configuration.matchAmount = 4;
        Configuration.maxHeldCrates = 3;
        Configuration.rematchDelay = 500;
        Configuration.startDelay = 1000;
        Configuration.spawnInterval = 3500;
        Configuration.maxStackSize = 25;
        Configuration.clickSpawnRate = 6;
        Configuration.clickSpawnCount = 1;
        Configuration.baseChainValue = 0.5;
        Configuration.chainIncValue = function () {
            return 0.5;
        };
        Configuration.getPoints = function (matches) {
            var crateValue = 1;
            game.State.chainValue += Configuration.chainIncValue();
            var chainValue = game.State.chainValue;
            var points = 0;

            matches.forEach(function (m) {
                points += (((m.count - Configuration.matchAmount + 1) * (m.count * crateValue)) * chainValue) * game.State.intensity();
            });

            return points;
        };

        Configuration.increaseIntensity = function () {
            game.State.intensity(game.State.intensity() + 1);
            game.State.pointThreshhold(game.State.pointThreshhold() + game.State.intensity() * Configuration.basePointThreshhold);
            game.State.clickSpawnRate = Configuration.clickSpawnRate - Math.floor(game.State.intensity() / 4);
            if (game.State.clickSpawnRate < 4) {
                game.State.clickSpawnCount++;
                game.State.clickSpawnRate = Configuration.clickSpawnRate - Math.floor((Math.floor(game.State.intensity() / 4) % 3));
            }
            game.State.totalSpawns = 0;
            var newSpecial = Configuration.getNewSpecialCrate();
            if (newSpecial != -1) {
                game.State.specialCrates.push(newSpecial);
            }
            game.State.cratePools = Configuration.getCratePools();
        };

        Configuration.getStackHeight = function () {
            return Configuration.stackHeight + Math.ceil(game.State.intensity() / 2);
        };

        Configuration.getSpawnInterval = function () {
            var time = Configuration.spawnInterval - (game.State.intensity() * 100);
            if (time < 1500)
                return 1500;
            return time;
        };

        Configuration.getCratePools = function () {
            return [
                {
                    countdown: 3,
                    baseCountdown: 3,
                    getVariance: function () {
                        return (Math.random() * 2) % 1;
                    },
                    types: [game.CrateType.rock, game.CrateType.rainbow]
                }, {
                    countdown: 4,
                    baseCountdown: 4,
                    getVariance: function () {
                        return (Math.random() * 2) % 1;
                    },
                    types: [game.CrateType.heavy]
                }];
        };
        return Configuration;
    })();
    exports.Configuration = Configuration;

    (function (GameMode) {
        GameMode[GameMode["Timed"] = 0] = "Timed";
        GameMode[GameMode["Click"] = 1] = "Click";
    })(exports.GameMode || (exports.GameMode = {}));
    var GameMode = exports.GameMode;
});
//# sourceMappingURL=common.js.map

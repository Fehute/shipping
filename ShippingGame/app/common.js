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
        Configuration.basePointThreshhold = 100;
        Configuration.numStacks = 5;
        Configuration.stackHeight = 8;
        Configuration.matchAmount = 4;
        Configuration.rematchDelay = 500;
        Configuration.startDelay = 1000;
        Configuration.spawnInterval = 3000;
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
            game.State.pointThreshhold += game.State.intensity() * Configuration.basePointThreshhold;
        };

        Configuration.getStackHeight = function () {
            return Configuration.stackHeight + Math.ceil(game.State.intensity() / 2);
        };
        Configuration.getSpawnInterval = function () {
            var time = Configuration.spawnInterval - (Configuration.spawnInterval * (game.State.intensity() / 20));
            if (time < 1500)
                return 1500;
            return time;
        };
        return Configuration;
    })();
    exports.Configuration = Configuration;
});
//# sourceMappingURL=common.js.map

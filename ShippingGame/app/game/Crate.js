///<amd-dependency path="text!game/templates/Crate.tmpl.html" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'common', 'knockout', 'game/Game', "text!game/templates/Crate.tmpl.html"], function(require, exports, common, ko, game) {
    var Crate = (function (_super) {
        __extends(Crate, _super);
        function Crate(container, crateData, prepend, notType, specialType) {
            if (typeof specialType === "undefined") { specialType = game.CrateType.none; }
            this.crateLabel = ko.observable("");
            this.crate = $(Templates.crate);
            this.initData(crateData, notType, specialType);
            _super.call(this, container, this.crate, prepend);
            ko.applyBindings(this, this.crate[0]);
        }
        Crate.prototype.remove = function () {
            this.crate.remove();
            return this;
        };

        Crate.prototype.matched = function () {
            var _this = this;
            //play animations and stuff
            this.crate.addClass('matched');
            setTimeout(function () {
                return _this.remove();
            }, common.Configuration.rematchDelay);

            if (this.type.special == game.CrateType.scramble) {
                //scramble crate effect - fill stack with random crates
                var randomCrates = [];
                for (var i = 0; i < game.State.maxHeldCrates(); i++) {
                    randomCrates.push({
                        type: new game.CrateType(game.CrateType.getRandomType())
                    });
                }
                game.State.crates(randomCrates);
            }
        };

        Crate.prototype.initData = function (data, notType, special) {
            if (typeof special === "undefined") { special = game.CrateType.none; }
            if (data) {
                this.type = data.type;
            } else {
                this.type = new game.CrateType(game.CrateType.getRandomType(notType), special);
            }

            this.crateStyle = ko.observable(this.type.getStyle());
        };

        Crate.prototype.getData = function () {
            return {
                type: this.type
            };
        };
        return Crate;
    })(common.BaseRepeatingModule);
    exports.Crate = Crate;

    var Templates;
    (function (Templates) {
        Templates.crate = require('text!game/templates/Crate.tmpl.html');
    })(Templates || (Templates = {}));
});
//# sourceMappingURL=Crate.js.map

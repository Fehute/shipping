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
            this.ability = $(Templates.ability);
            this.type = ko.computed(function () {
                return data.type();
            });
            this.charges = ko.computed(function () {
                return data.charges();
            });
            this.cooldown = ko.computed(function () {
                return data.cooldown();
            });
            this.style = ko.observable(Ability.getStyle(this.type()));
            this.name = ko.observable(Ability.getName(this.type()));
            _super.call(this, container, this.ability);
            ko.applyBindings(this, this.ability[0]);
        }
        Ability.prototype.setData = function (data) {
            this.type = ko.computed(function () {
                return data.type();
            });
            this.charges = ko.computed(function () {
                return data.charges();
            });
            this.cooldown = ko.computed(function () {
                return data.cooldown();
            });
        };

        Ability.prototype.remove = function () {
            this.ability.remove();
        };

        Ability.prototype.useAbility = function () {
            if (this.type() == 1 /* clearStack */) {
                game.State.targetingMode = 1 /* clearStack */;
            }
        };

        Ability.getStyle = function (ability) {
            return Ability.styles[ability];
        };

        Ability.getName = function (ability) {
            return Ability.styles[ability];
        };
        Ability.styles = ["empty", "clearStack"];

        Ability.names = ["Empty", "clearStack"];
        return Ability;
    })(common.BaseRepeatingModule);
    exports.Ability = Ability;

    var AbilityData = (function () {
        function AbilityData(type, charges, cooldown) {
            if (typeof type === "undefined") { type = 0 /* empty */; }
            if (typeof charges === "undefined") { charges = 0; }
            if (typeof cooldown === "undefined") { cooldown = 0; }
            this.type = ko.observable(type);
            this.charges = ko.observable(charges);
            this.cooldown = ko.observable(cooldown);
        }
        return AbilityData;
    })();
    exports.AbilityData = AbilityData;

    (function (AbilityType) {
        AbilityType[AbilityType["empty"] = 0] = "empty";
        AbilityType[AbilityType["clearStack"] = 1] = "clearStack";
    })(exports.AbilityType || (exports.AbilityType = {}));
    var AbilityType = exports.AbilityType;

    var Templates;
    (function (Templates) {
        Templates.ability = require('text!game/templates/Ability.tmpl.html');
    })(Templates || (Templates = {}));
});
//# sourceMappingURL=Ability.js.map

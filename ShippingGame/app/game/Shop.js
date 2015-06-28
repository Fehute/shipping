///<amd-dependency path="text!game/templates/modals/Shop.tmpl.html" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'common', 'knockout', 'game/Game', 'game/Ability', "text!game/templates/modals/Shop.tmpl.html"], function(require, exports, common, ko, game, ability) {
    var Shop = (function (_super) {
        __extends(Shop, _super);
        function Shop(container, onClose) {
            var _this = this;
            _super.call(this, container, Templates.shop);
            this.currentStock = ko.observableArray([]);
            this.buyAbility = function (item) {
                console.log(item);
                game.State.abilities.push(new ability.AbilityData(item.type, 3, 30, 10));
                _this.currentStock().splice(_this.currentStock.indexOf(item), 1);
                _this.currentStock(_this.currentStock());
            };
            this.shop = this._template;

            this.stock = common.Configuration.shopStock;
            this.abilityChoicesContainer = this.shop.find('.abilityChoices');
            this.onClose = onClose;

            ko.applyBindings(this, this.shop[0]);

            this.refreshChoices();

            console.log(this.currentStock());
        }
        Shop.prototype.refreshChoices = function () {
            var options = ability.Ability.getShoppable();
            this.currentStock([]);

            var choice;
            for (var i = 0; i < this.stock; i++) {
                choice = Math.floor(Math.random() * options.length);
                var option = options.splice(choice, 1)[0];
                this.currentStock.push({
                    type: option,
                    name: ability.Ability.getName(option),
                    price: 1
                });
            }
        };

        Shop.prototype.updateAbilities = function (val) {
            /*
            val.forEach((a, i) => {
            // add or replace abilities as necessary
            if (!this.abilities[i]) {
            this.abilities[i] = new ability.Ability(this.abilitySlotsContainer, a);
            } else if (a.type() != this.abilities[i].type()) {
            this.abilities[i].remove();
            this.abilities[i] = new ability.Ability(this.abilitySlotsContainer, a);
            }
            });
            */
        };
        return Shop;
    })(common.BaseRepeatingModule);
    exports.Shop = Shop;

    var Templates;
    (function (Templates) {
        Templates.shop = require('text!game/templates/modals/Shop.tmpl.html');
    })(Templates || (Templates = {}));
});
//# sourceMappingURL=Shop.js.map

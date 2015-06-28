///<amd-dependency path="text!game/templates/modals/Shop.tmpl.html" />

import common = require('common');
import ko = require('knockout');
import game = require('game/Game');
import ability = require('game/Ability');

export class Shop extends common.BaseRepeatingModule {
    shop: JQuery;
    abilityChoicesContainer: JQuery;
    abilityChoices: ability.AbilityType;
    onClose: () => void;
    stock: number;
    currentStock: KnockoutObservableArray<StockItem> = ko.observableArray([]);

    constructor(container: JQuery, onClose: () => void) {
        super(container, Templates.shop);
        this.shop = this._template;

        this.stock = common.Configuration.shopStock;
        this.abilityChoicesContainer = this.shop.find('.abilityChoices');
        this.onClose = onClose;

        ko.applyBindings(this, this.shop[0]);

        this.refreshChoices();

        console.log(this.currentStock());
    }

    refreshChoices() {
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
    }

    buyAbility = (item: StockItem) => {
        console.log(item);
        game.State.abilities.push(new ability.AbilityData(item.type, 3, 30, 10));
        this.currentStock().splice(this.currentStock.indexOf(item), 1);
        this.currentStock(this.currentStock());
    }

    updateAbilities(val: ability.AbilityData[]) {
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
    }
}

export interface StockItem {
    type: ability.AbilityType;
    name: string;
    price: number;
}

module Templates {
    export var shop = <string>require('text!game/templates/modals/Shop.tmpl.html');
} 
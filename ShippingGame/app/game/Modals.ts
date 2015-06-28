///<amd-dependency path="text!game/templates/modals/GameOver.tmpl.html" />
///<amd-dependency path="text!game/templates/modals/NextLevel.tmpl.html" />
///<amd-dependency path="text!game/templates/modals/GameType.tmpl.html" />
///<amd-dependency path="text!game/templates/modals/Paused.tmpl.html" />

import common = require('common');
import board = require('game/Board');
import ko = require('knockout');
import game = require('game/Game');
import shop = require('game/Shop');

export class Modals {
    modals: JQuery[] = [];

    constructor(private container: JQuery) {
    }

    gameLost(onClose: () => void) {
        var modal = $(Templates.gameOver);
        this.modals.push(modal);
        this.container.append(modal);
        this.container.find('.closeModal').click(() => {
            modal.remove();
            onClose();
        });
    }

    nextLevel(onClose: () => void) {
        var modal = $(Templates.nextLevel);
        this.modals.push(modal);
        this.container.append(modal);
        this.container.find('.closeModal').click(() => {
            modal.remove();
            onClose();
        });

        this.container.find('.openShop').click(() => {
            this.shop(onClose);
            modal.remove();
        });
    }

    gameType(onSelect: (mode:common.GameMode) => void) {
        var modal = $(Templates.gameType);
        this.modals.push(modal);
        this.container.append(modal);
        this.container.find('.timeButton').click(() => {
            modal.remove();
            onSelect(common.GameMode.Timed);
        });
        this.container.find('.clickButton').click(() => {
            modal.remove();
            onSelect(common.GameMode.Click);
        });
    }

    paused(onClose: () => void) {
        var modal = $(Templates.paused);
        this.modals.push(modal);
        this.container.append(modal);
        this.container.find('.closeModal').click(() => {
            modal.remove();
            onClose();
        });
    }

    shop(onClose: () => void) {
        var modal = $(Templates.shop);
        this.modals.push(modal);
        this.container.append(modal);
        var onShopClose = () => {
            modal.remove();
            onClose();
        };

        var shopContents = new shop.Shop(modal, onShopClose);

        this.container.find('.closeModal').click(onShopClose);
    }
} 

module Templates {
    export var gameOver = <string>require('text!game/templates/modals/GameOver.tmpl.html');
    export var nextLevel = <string>require('text!game/templates/modals/NextLevel.tmpl.html');
    export var gameType = <string>require('text!game/templates/modals/GameType.tmpl.html');
    export var paused = <string>require('text!game/templates/modals/Paused.tmpl.html');
    export var shop = "<div class='shopContainer'></div>";
}
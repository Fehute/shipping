///<amd-dependency path="text!game/templates/modals/GameOver.tmpl.html" />
///<amd-dependency path="text!game/templates/modals/NextLevel.tmpl.html" />
///<amd-dependency path="text!game/templates/modals/GameType.tmpl.html" />

import common = require('common');
import board = require('game/Board');
import ko = require('knockout');

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
} 

module Templates {
    export var gameOver = <string>require('text!game/templates/modals/GameOver.tmpl.html');
    export var nextLevel = <string>require('text!game/templates/modals/NextLevel.tmpl.html');
    export var gameType = <string>require('text!game/templates/modals/GameType.tmpl.html');
}
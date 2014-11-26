///<amd-dependency path="text!game/templates/Board.tmpl.html" />

import common = require('common');
import field = require('game/Field');
import status = require('game/Status');

export class Board extends common.BaseModule {
    field: field.Field;
    status: status.Status;
    constructor(container: JQuery) {
        super(container, Templates.board);
        this.field = new field.Field($('.fieldContainer'));
        this.status = new status.Status($('.statusContainer'));
    }

    reset() {
        this.field.reset();
        this.status.resetTimer();
    }

    pause() {
        this.field.pause();
        this.status.stopTimer();
    }

    resume() {
        this.field.resume();
        this.status.startTimer();
    }
}

module Templates {
    export var board = <string>require('text!game/templates/Board.tmpl.html');
}
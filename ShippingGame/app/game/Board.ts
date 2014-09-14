///<amd-dependency path="text!game/templates/Board.tmpl.html" />

import common = require('common');
import field = require('game/Field');

export class Board extends common.BaseModule {
    field: field.Field;
    constructor (container: JQuery) {
        super(container, Templates.board);
        this.field = new field.Field($('.fieldContainer'));
    }
}

module Templates {
    export var board = <string>require('text!game/templates/Board.tmpl.html');
}
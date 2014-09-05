///<amd-dependency path="text!game/templates/Board.tmpl.html" />

import common = require('common');
 
export class Board extends common.BaseModule {
    constructor(container: JQuery) {
        super(container, Templates.board);
    }
}

module Templates {
    export var board = <string>require('text!game/templates/Board.tmpl.html');
}
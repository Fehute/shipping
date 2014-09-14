///<amd-dependency path="text!game/templates/Crate.tmpl.html" />

import common = require('common');

export class Crate extends common.BaseRepeatingModule {
    constructor(container: JQuery) {
        super(container, Templates.crate);
    }
}

module Templates {
    export var crate = <string>require('text!game/templates/Crate.tmpl.html');
} 
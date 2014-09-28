///<amd-dependency path="text!game/templates/Field.tmpl.html" />

import common = require('common');
import stack = require('game/Stack');
import ko = require('knockout');

export class Field extends common.BaseModule {
    stacks: KnockoutObservableArray<stack.Stack>;
    constructor(container: JQuery) {
        super(container, Templates.field);
        this.stacks = ko.observableArray(this.generateStartingStacks());
    }

    generateStartingStacks(): stack.Stack[]{
        var stacks = [];
        for (var i = 0; i < common.Configuration.numStacks; i++) {
            stacks.push(new stack.Stack($('.stackContainer')));
        }
        return stacks;
    }

    checkForMatch() {

    }
}

module Templates {
    export var field = <string>require('text!game/templates/Field.tmpl.html');
} 
///<amd-dependency path="text!game/templates/Field.tmpl.html" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'common', 'game/Stack', 'knockout', "text!game/templates/Field.tmpl.html"], function(require, exports, common, stack, ko) {
    var Field = (function (_super) {
        __extends(Field, _super);
        function Field(container) {
            _super.call(this, container, Templates.field);
            this.stacks = ko.observableArray(this.generateStartingStacks());
        }
        Field.prototype.generateStartingStacks = function () {
            var stacks = [];
            for (var i = 0; i < common.Configuration.numStacks; i++) {
                stacks.push(new stack.Stack($('.stackContainer')));
            }
            return stacks;
        };
        return Field;
    })(common.BaseModule);
    exports.Field = Field;

    var Templates;
    (function (Templates) {
        Templates.field = require('text!game/templates/Field.tmpl.html');
    })(Templates || (Templates = {}));
});
//# sourceMappingURL=Field.js.map

///<amd-dependency path="text!game/templates/Stack.tmpl.html" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'common', 'knockout', 'game/Crate', "text!game/templates/Stack.tmpl.html"], function(require, exports, common, ko, crate) {
    var Stack = (function (_super) {
        __extends(Stack, _super);
        function Stack(container) {
            this.stack = $(Templates.stack);
            _super.call(this, container, this.stack);
            ko.applyBindings(this, this.stack[0]);
            this.crates = ko.observableArray(this.generateStartingCrates());
        }
        Stack.prototype.generateStartingCrates = function () {
            var crates = [];
            for (var i = 0; i < common.Configuration.numStacks; i++) {
                crates.push(new crate.Crate($('.crateContainer')));
            }
            return crates;
        };
        return Stack;
    })(common.BaseRepeatingModule);
    exports.Stack = Stack;

    var Templates;
    (function (Templates) {
        Templates.stack = require('text!game/templates/Stack.tmpl.html');
    })(Templates || (Templates = {}));
});
//# sourceMappingURL=Stack.js.map

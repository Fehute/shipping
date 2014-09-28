///<amd-dependency path="text!game/templates/Stack.tmpl.html" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'common', 'knockout', 'game/Crate', 'Input', 'game/Game', "text!game/templates/Stack.tmpl.html"], function(require, exports, common, ko, crate, input, game) {
    var Stack = (function (_super) {
        __extends(Stack, _super);
        function Stack(container) {
            var _this = this;
            this.stack = $(Templates.stack);
            this.crateContainer = $('.crateContainer', this.stack);
            _super.call(this, container, this.stack);
            ko.applyBindings(this, this.stack[0]);
            this.crates = ko.observableArray(this.generateStartingCrates());

            var self = this;
            input.grab(this.stack, function () {
                return _this.grab.apply(self, arguments);
            });
            input.release(this.stack, function () {
                return _this.release.apply(self, arguments);
            });
        }
        Stack.prototype.generateStartingCrates = function () {
            var crates = [];
            for (var i = 0; i < common.Configuration.stackHeight; i++) {
                crates.push(new crate.Crate(this.crateContainer));
            }
            return crates;
        };

        Stack.prototype.grab = function () {
            var crate = this.popCrate();
            game.State.crate = crate.getData();
        };

        Stack.prototype.release = function () {
            if (game.State.crate) {
                this.crates.push(new crate.Crate(this.crateContainer, game.State.crate));
                game.State.crate = null;
            }
        };

        Stack.prototype.popCrate = function () {
            return this.crates.pop().remove();
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

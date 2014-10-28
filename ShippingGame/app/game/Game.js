///<amd-dependency path="text!game/templates/Game.tmpl.html" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'common', 'game/Board', "text!game/templates/Game.tmpl.html"], function(require, exports, common, board) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game(container, args) {
            _super.call(this, container, Templates.game);
            this.board = new board.Board($('.boardContainer'));
        }
        return Game;
    })(common.BaseModule);
    exports.Game = Game;

    var State = (function () {
        function State() {
        }
        State.crate = null;
        return State;
    })();
    exports.State = State;

    var CrateType = (function () {
        function CrateType(type) {
            this.type = type;
        }
        CrateType.prototype.getStyle = function () {
            return CrateType.styles[this.type];
        };

        CrateType.prototype.is = function (t) {
            return this.type == t;
        };

        CrateType.getRandomType = function (notType) {
            var types = [
                CrateType.one,
                CrateType.two,
                CrateType.three,
                CrateType.four,
                CrateType.five
            ].filter(function (t) {
                return !notType || !notType.is(t);
            });

            return types[Math.floor(Math.random() * types.length)];
        };

        CrateType.prototype.matches = function (c) {
            return this.type == c.type;
        };
        CrateType.one = 0;
        CrateType.two = 1;
        CrateType.three = 2;
        CrateType.four = 3;
        CrateType.five = 4;

        CrateType.styles = ["one", "two", "three", "four", "five"];
        return CrateType;
    })();
    exports.CrateType = CrateType;

    var Templates;
    (function (Templates) {
        Templates.game = require('text!game/templates/Game.tmpl.html');
    })(Templates || (Templates = {}));
});
/*
* powers:
* -extra delay before matching
* -depth charge
*
*
* todo:
* secret blind guardian level
*/
//# sourceMappingURL=Game.js.map

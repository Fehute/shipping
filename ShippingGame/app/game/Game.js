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

    var Templates;
    (function (Templates) {
        Templates.game = require('text!game/templates/Game.tmpl.html');
    })(Templates || (Templates = {}));
});
//# sourceMappingURL=Game.js.map

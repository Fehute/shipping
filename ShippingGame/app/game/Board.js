///<amd-dependency path="text!game/templates/Board.tmpl.html" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'common', 'game/Field', "text!game/templates/Board.tmpl.html"], function(require, exports, common, field) {
    var Board = (function (_super) {
        __extends(Board, _super);
        function Board(container) {
            _super.call(this, container, Templates.board);
            this.field = new field.Field($('.fieldContainer'));
        }
        return Board;
    })(common.BaseModule);
    exports.Board = Board;

    var Templates;
    (function (Templates) {
        Templates.board = require('text!game/templates/Board.tmpl.html');
    })(Templates || (Templates = {}));
});
//# sourceMappingURL=Board.js.map

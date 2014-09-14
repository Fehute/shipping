///<amd-dependency path="text!game/templates/Crate.tmpl.html" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'common', "text!game/templates/Crate.tmpl.html"], function(require, exports, common) {
    var Crate = (function (_super) {
        __extends(Crate, _super);
        function Crate(container) {
            _super.call(this, container, Templates.crate);
        }
        return Crate;
    })(common.BaseRepeatingModule);
    exports.Crate = Crate;

    var Templates;
    (function (Templates) {
        Templates.crate = require('text!game/templates/Crate.tmpl.html');
    })(Templates || (Templates = {}));
});
//# sourceMappingURL=Crate.js.map

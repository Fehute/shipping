///<amd-dependency path="text!game/templates/Crate.tmpl.html" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'common', 'knockout', 'game/Game', "text!game/templates/Crate.tmpl.html"], function(require, exports, common, ko, game) {
    var Crate = (function (_super) {
        __extends(Crate, _super);
        function Crate(container, crateData) {
            this.crateLabel = ko.observable("");
            this.crate = $(Templates.crate);
            this.initData(crateData);
            _super.call(this, container, this.crate);
            ko.applyBindings(this, this.crate[0]);
        }
        Crate.prototype.remove = function () {
            this.crate.remove();
            return this;
        };

        Crate.prototype.initData = function (data) {
            if (data) {
                this.type = data.type;
            } else {
                this.type = new game.CrateType(game.CrateType.getRandomType());
            }

            var styles = [
                game.CrateType.one,
                game.CrateType.two,
                game.CrateType.three,
                game.CrateType.four,
                game.CrateType.five
            ];
            this.crateStyle = ko.observable(this.type.getStyle());
        };

        Crate.prototype.getData = function () {
            return {
                type: this.type
            };
        };
        return Crate;
    })(common.BaseRepeatingModule);
    exports.Crate = Crate;

    var Templates;
    (function (Templates) {
        Templates.crate = require('text!game/templates/Crate.tmpl.html');
    })(Templates || (Templates = {}));
});
//# sourceMappingURL=Crate.js.map

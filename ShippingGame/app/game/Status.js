///<amd-dependency path="text!game/templates/Status.tmpl.html" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'common', 'knockout', 'game/Game', "text!game/templates/Status.tmpl.html"], function(require, exports, common, ko, game) {
    var Status = (function (_super) {
        __extends(Status, _super);
        function Status(container, crateData) {
            var _this = this;
            this.score = game.State.score;
            this.intensity = game.State.intensity;
            this.status = $(Templates.status);

            var d = new Date();
            var offset = d.getTimezoneOffset();
            this.startTime = d.getTime() - offset * 60000;
            this.timeElapsed = ko.observable(this.getTime());

            _super.call(this, container, this.status);
            ko.applyBindings(this, this.status[0]);

            setInterval(function () {
                _this.timeElapsed(_this.getTime());
            }, 1000);
        }
        Status.prototype.getTime = function () {
            var d = new Date();
            var offset = d.getTimezoneOffset();
            return new Date(d.getTime() - this.startTime).toTimeString().split(" ")[0];
        };
        return Status;
    })(common.BaseRepeatingModule);
    exports.Status = Status;

    var Templates;
    (function (Templates) {
        Templates.status = require('text!game/templates/Status.tmpl.html');
    })(Templates || (Templates = {}));
});
//# sourceMappingURL=Status.js.map

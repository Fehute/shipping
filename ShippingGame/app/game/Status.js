///<amd-dependency path="text!game/templates/Status.tmpl.html" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'common', 'knockout', 'game/Game', 'game/Crate', "text!game/templates/Status.tmpl.html"], function(require, exports, common, ko, game, crate) {
    var Status = (function (_super) {
        __extends(Status, _super);
        function Status(container, crateData) {
            var _this = this;
            this.score = game.State.score;
            this.intensity = game.State.intensity;
            this.status = $(Templates.status);
            this.pointThreshhold = game.State.pointThreshhold;
            this.stackContents = game.State.crates;
            this.heldCrates = [];
            this.heldCratesContainer = this.status.find('.heldCrates');
            this.pauseLabel = ko.observable("Pause");
            var self = this;
            var updateCrates = this.updateCrates;
            game.State.crates.subscribe(function () {
                return updateCrates.apply(self, arguments);
            });

            var d = new Date();
            var offset = d.getTimezoneOffset();
            this.startTime = d.getTime() - offset * 60000;
            this.timeElapsed = ko.observable(this.getTime());

            _super.call(this, container, this.status);
            ko.applyBindings(this, this.status[0]);

            this.timer = setInterval(function () {
                _this.timeElapsed(_this.getTime());
            }, 1000);
        }
        Status.prototype.getTime = function () {
            var d = new Date();
            var offset = d.getTimezoneOffset();
            return new Date(d.getTime() - this.startTime).toTimeString().split(" ")[0];
        };

        Status.prototype.stopTimer = function () {
            window.clearInterval(this.timer);
            this.timer = null;
        };

        Status.prototype.resetTimer = function () {
            if (this.timer)
                this.stopTimer();
            var d = new Date();
            var offset = d.getTimezoneOffset();
            this.startTime = d.getTime() - offset * 60000;
            this.timeElapsed(this.getTime());

            this.startTimer();
        };

        Status.prototype.startTimer = function () {
            var _this = this;
            if (this.timer)
                this.stopTimer();
            this.timer = setInterval(function () {
                _this.timeElapsed(_this.getTime());
            }, 1000);
        };

        Status.prototype.updateCrates = function (val) {
            var _this = this;
            this.heldCrates.forEach(function (c) {
                return c.remove();
            });
            this.heldCrates = [];

            val.forEach(function (cd) {
                return _this.heldCrates.push(new crate.Crate(_this.heldCratesContainer, cd));
            });
        };

        Status.prototype.pauseGame = function () {
            game.State.game.board.pause();
            game.State.game.modals.paused();
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

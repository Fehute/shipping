///<amd-dependency path="text!game/templates/modals/GameOver.tmpl.html" />
///<amd-dependency path="text!game/templates/modals/NextLevel.tmpl.html" />
///<amd-dependency path="text!game/templates/modals/GameType.tmpl.html" />
///<amd-dependency path="text!game/templates/modals/Paused.tmpl.html" />
define(["require", "exports", 'common', "text!game/templates/modals/GameOver.tmpl.html", "text!game/templates/modals/NextLevel.tmpl.html", "text!game/templates/modals/GameType.tmpl.html", "text!game/templates/modals/Paused.tmpl.html"], function(require, exports, common) {
    var Modals = (function () {
        function Modals(container) {
            this.container = container;
            this.modals = [];
        }
        Modals.prototype.gameLost = function (onClose) {
            var modal = $(Templates.gameOver);
            this.modals.push(modal);
            this.container.append(modal);
            this.container.find('.closeModal').click(function () {
                modal.remove();
                onClose();
            });
        };

        Modals.prototype.nextLevel = function (onClose) {
            var modal = $(Templates.nextLevel);
            this.modals.push(modal);
            this.container.append(modal);
            this.container.find('.closeModal').click(function () {
                modal.remove();
                onClose();
            });
        };

        Modals.prototype.gameType = function (onSelect) {
            var modal = $(Templates.gameType);
            this.modals.push(modal);
            this.container.append(modal);
            this.container.find('.timeButton').click(function () {
                modal.remove();
                onSelect(0 /* Timed */);
            });
            this.container.find('.clickButton').click(function () {
                modal.remove();
                onSelect(1 /* Click */);
            });
        };

        Modals.prototype.paused = function (onClose) {
            var modal = $(Templates.paused);
            this.modals.push(modal);
            this.container.append(modal);
            this.container.find('.closeModal').click(function () {
                modal.remove();
                onClose();
            });
        };
        return Modals;
    })();
    exports.Modals = Modals;

    var Templates;
    (function (Templates) {
        Templates.gameOver = require('text!game/templates/modals/GameOver.tmpl.html');
        Templates.nextLevel = require('text!game/templates/modals/NextLevel.tmpl.html');
        Templates.gameType = require('text!game/templates/modals/GameType.tmpl.html');
        Templates.paused = require('text!game/templates/modals/Paused.tmpl.html');
    })(Templates || (Templates = {}));
});
//# sourceMappingURL=Modals.js.map

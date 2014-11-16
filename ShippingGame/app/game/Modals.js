///<amd-dependency path="text!game/templates/modals/GameOver.tmpl.html" />
///<amd-dependency path="text!game/templates/modals/NextLevel.tmpl.html" />
define(["require", "exports", "text!game/templates/modals/GameOver.tmpl.html", "text!game/templates/modals/NextLevel.tmpl.html"], function(require, exports) {
    var Modals = (function () {
        function Modals(container) {
            this.container = container;
            this.modals = [];
        }
        Modals.prototype.gameLost = function (onClose) {
            var modal = $(Templates.gameOver);
            this.modals.push(modal);
            this.container.append(modal);
            this.container.find($('.closeModal')).click(function () {
                modal.remove();
                onClose();
            });
        };

        Modals.prototype.nextLevel = function (onClose) {
            var modal = $(Templates.nextLevel);
            this.modals.push(modal);
            this.container.append(modal);
            this.container.find($('.closeModal')).click(function () {
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
    })(Templates || (Templates = {}));
});
//# sourceMappingURL=Modals.js.map

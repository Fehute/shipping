//https://github.com/borisyankov/DefinitelyTyped
define(["require", "exports", "game/Game", 'knockout'], function(require, exports, game, ko) {
    var Greeter = (function () {
        function Greeter(element) {
            this.element = element;
            this.game = new game.Game($('.gameContainer'));
            ko.applyBindings(this, this.element);
        }
        return Greeter;
    })();

    //ko["amdTemplateEngine"]["defaultPath"] = 'game/templates';
    var el = $('#content')[0];
    var greeter = new Greeter(el);
});
//todo here:
//game configuration
//custom knockout bindings
//desktop/mobile handling
//input
//# sourceMappingURL=app.js.map

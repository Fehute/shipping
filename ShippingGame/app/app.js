//https://github.com/borisyankov/DefinitelyTyped
define(["require", "exports", "game/Game"], function(require, exports, game) {
    var App = (function () {
        function App(element) {
            this.element = element;
            this.game = new game.Game($('.gameContainer'));
            //ko.applyBindings(this, this.element);
        }
        return App;
    })();

    //ko["amdTemplateEngine"]["defaultPath"] = 'game/templates';
    var el = $('#content')[0];
    var greeter = new App(el);
});
//todo here:
//game configuration
//custom knockout bindings
//desktop/mobile handling
//input
//Game has Board
//Board has field and UI
//Field has stacks
//Stacks have crates
//# sourceMappingURL=app.js.map

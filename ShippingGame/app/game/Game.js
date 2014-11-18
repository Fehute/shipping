///<amd-dependency path="text!game/templates/Game.tmpl.html" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'common', 'game/Board', 'knockout', 'game/Modals', "text!game/templates/Game.tmpl.html"], function(require, exports, common, board, ko, modals) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game(container, args) {
            var _this = this;
            _super.call(this, container, Templates.game);
            this.lost = false;
            State.game = this;
            this.board = new board.Board($('.boardContainer'));
            this.modals = new modals.Modals($('.modalsContainer'));

            var self = this;
            var restart = this.restart;
            var gameType = this.gameType;

            State.score.subscribe(function (score) {
                if (score >= State.pointThreshhold()) {
                    _this.board.field.pause();
                    State.crates([]);
                    common.Configuration.increaseIntensity();

                    _this.modals.nextLevel(function () {
                        return restart.apply(self);
                    });
                }
            });

            this.board.pause();
            this.modals.gameType(function () {
                return gameType.apply(self, arguments);
            });
        }
        Game.prototype.gameType = function (mode) {
            State.gameMode = mode;
            if (mode == 1 /* Click */) {
                State.clickSpawnRate = common.Configuration.clickSpawnRate;
                State.clickSpawnCount = common.Configuration.clickSpawnCount;
            } else if (mode == 0 /* Timed */) {
            }
            this.board.reset();
        };

        Game.prototype.gameLost = function () {
            var _this = this;
            if (!this.lost) {
                this.lost = true;
                this.board.pause();

                var self = this;
                var restart = this.restart;
                this.modals.gameLost(function () {
                    State.score(0);
                    State.chainValue = common.Configuration.baseChainValue;
                    State.intensity(1);
                    State.pointThreshhold(common.Configuration.basePointThreshhold);
                    _this.board.status.resetTimer();
                    State.crates([]);
                    restart.apply(self);
                });
            }
        };

        Game.prototype.restart = function () {
            this.lost = false;
            this.board.reset();
        };
        return Game;
    })(common.BaseModule);
    exports.Game = Game;

    var State = (function () {
        function State() {
        }
        State.crates = ko.observableArray(new Array());
        State.chainValue = common.Configuration.baseChainValue;
        State.score = ko.observable(0);
        State.intensity = ko.observable(1);
        State.pointThreshhold = ko.observable(common.Configuration.basePointThreshhold);
        return State;
    })();
    exports.State = State;

    var CrateType = (function () {
        function CrateType(type) {
            this.type = type;
        }
        CrateType.prototype.getStyle = function () {
            return CrateType.styles[this.type];
        };

        CrateType.prototype.is = function (t) {
            return this.type == t;
        };

        CrateType.getRandomType = function (notType) {
            var types = [
                CrateType.one,
                CrateType.two,
                CrateType.three,
                CrateType.four,
                CrateType.five
            ].filter(function (t) {
                return !notType || !notType.is(t);
            });

            return types[Math.floor(Math.random() * types.length)];
        };

        CrateType.prototype.matches = function (c) {
            return this.type == c.type;
        };
        CrateType.one = 0;
        CrateType.two = 1;
        CrateType.three = 2;
        CrateType.four = 3;
        CrateType.five = 4;

        CrateType.styles = ["one", "two", "three", "four", "five"];
        return CrateType;
    })();
    exports.CrateType = CrateType;

    var Templates;
    (function (Templates) {
        Templates.game = require('text!game/templates/Game.tmpl.html');
    })(Templates || (Templates = {}));
});
/*
* powers:
* -extra delay before matching
* -depth charge
*
*
* todo:
* secret blind guardian level
*/
//# sourceMappingURL=Game.js.map

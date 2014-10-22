define(["require", "exports", 'knockout'], function(require, exports, ko) {
    

    function applyTemplate(target, data, template, bind, prepend) {
        if (typeof bind === "undefined") { bind = true; }
        var el;
        if (prepend) {
            el = $(target).prepend(template);
        } else {
            el = $(target).append(template);
        }
        if (bind) {
            ko.applyBindings(data, el[0]);
        }
    }
    exports.applyTemplate = applyTemplate;

    var BaseModule = (function () {
        function BaseModule(container, template) {
            this.container = container;
            this.template = template;
            this.self = this;
            this.render();
        }
        BaseModule.prototype.render = function () {
            exports.applyTemplate(this.container, this, this.template);
        };
        return BaseModule;
    })();
    exports.BaseModule = BaseModule;

    var BaseRepeatingModule = (function () {
        function BaseRepeatingModule(container, template, prepend) {
            this.container = container;
            this.template = template;
            this.prepend = prepend;
            this.render();
        }
        BaseRepeatingModule.prototype.render = function () {
            exports.applyTemplate(this.container, this, this.template, false, this.prepend);
        };
        return BaseRepeatingModule;
    })();
    exports.BaseRepeatingModule = BaseRepeatingModule;

    var Configuration = (function () {
        function Configuration() {
        }
        Configuration.numStacks = 5;
        Configuration.stackHeight = 8;
        Configuration.matchAmount = 4;
        Configuration.rematchDelay = 500;
        Configuration.startDelay = 1000;
        Configuration.spawnInterval = 3000;
        return Configuration;
    })();
    exports.Configuration = Configuration;
});
//# sourceMappingURL=common.js.map

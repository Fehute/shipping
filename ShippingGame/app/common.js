define(["require", "exports", 'knockout'], function(require, exports, ko) {
    

    function applyTemplate(target, data, template, bind) {
        if (typeof bind === "undefined") { bind = true; }
        var el = $(target).append(template);
        if (bind) {
            ko.applyBindings(data, el[0]);
        }
    }
    exports.applyTemplate = applyTemplate;

    var BaseModule = (function () {
        function BaseModule(container, template) {
            exports.applyTemplate(container, this, template);
        }
        return BaseModule;
    })();
    exports.BaseModule = BaseModule;

    var BaseRepeatingModule = (function () {
        function BaseRepeatingModule(container, template) {
            exports.applyTemplate(container, this, template, false);
        }
        return BaseRepeatingModule;
    })();
    exports.BaseRepeatingModule = BaseRepeatingModule;

    var Configuration = (function () {
        function Configuration() {
        }
        Configuration.numStacks = 5;
        Configuration.stackHeight = 8;
        return Configuration;
    })();
    exports.Configuration = Configuration;
});
//# sourceMappingURL=common.js.map

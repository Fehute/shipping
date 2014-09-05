define(["require", "exports", 'knockout'], function(require, exports, ko) {
    

    function applyTemplate(target, data, template) {
        var el = $(target).html(template);
        ko.applyBindings(data, el[0]);
    }
    exports.applyTemplate = applyTemplate;

    var BaseModule = (function () {
        function BaseModule(container, template) {
            exports.applyTemplate(container, this, template);
        }
        return BaseModule;
    })();
    exports.BaseModule = BaseModule;
});
//# sourceMappingURL=common.js.map

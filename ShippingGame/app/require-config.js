
require.config({
    paths: {
        //project locations
        lib: 'lib',
        game: 'game',
        menus: 'menus',

        //library locations
        jquery: 'lib/jquery-1.11.1.min',
        knockout: 'lib/knockout-3.2.0',
        //koamd: 'lib/knockout-amd-helpers.min',
        gridster: 'lib/jquery.gridster.min',
        text: 'lib/text',

        main: 'app',
    },
    shim: {
        'main': {
            deps: ['jquery', 'knockout', 'gridster']
        },

        'gridster': {
            deps: ['jquery']
        },
    }
});

require(['main'], function () {
})

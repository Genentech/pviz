requirejs.config({
    baseUrl : 'js',

    paths : {
        pviz : '.',
        pviz_templates : '../templates',

        jQuery : '../lib/jquery-1.8.3.min',
        underscore : '../lib/underscore-min',
        backbone : '../lib/backbone-min',
        d3 : '../lib/d3.v3.min',
        bootstrap : '../lib/bootstrap.min',
        text : '../lib/require/text',
        domReady : '../lib/require/domReady'
    },
    shim : {
        'jQuery' : {
            exports : '$'
        },
        'underscore' : {
            exports : '_'
        },
        'backbone' : {
            // These script dependencies should be loaded before loading
            // backbone.js
            deps : ['underscore', 'jQuery'],
            // Once loaded, use the global 'Backbone' as the
            // module value.
            exports : 'Backbone'
        },
        d3 : {
            exports : 'd3'
        }
    }
});

require(['app'], function(App) {
    App.initialize();
})
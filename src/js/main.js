requirejs.config({
    baseUrl: 'js',
    paths: {
        pviz: '.',
        pviz_templates: '../templates',
		jquery: '../../bower_components/jquery/jquery',
        bootstrap: '../../bower_components/bootstrap/dist/js/bootstrap',
		requirejs: '../../bower_components/requirejs/require',
        'domReady': '../../bower_components/requirejs-domready/domReady',
        'text': '../../bower_components/requirejs-text/text',
        'd3': '../../bower_components/d3-amd/d3',
        'backbone': '../../bower_components/backbone-amd/backbone',
        'underscore': '../../bower_components/underscore-amd/underscore'
    },
    shim: {
        jquery: {
            exports: '$'
        },
		bootstrap : {
            deps: ['jquery']
        },
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        'd3': {
            exports: 'd3'
        }
    }
});

require(['app'], function(App) {
    App.initialize();
})
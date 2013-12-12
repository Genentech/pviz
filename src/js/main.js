requirejs.config({
    baseUrl: 'js',
    paths: {
        pviz: '.',
        pviz_templates: '../templates',
        bootstrap: '../../bower_components/bootstrap/dist/js/bootstrap',
        jquery: '../../bower_components/jquery/jquery',
        'requirejs-domready': '../../bower_components/requirejs-domready/domReady',
        'text': '../../bower_components/requirejs-text/text',
        requirejs: '../../bower_components/requirejs/require',
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
        'underscore': {
            exports: '_'
        },
        'backbone': {
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
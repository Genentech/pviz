requirejs.config({
    baseUrl: 'js',
    paths: {
        pviz: '.',
        pviz_templates: '../templates',
        jquery: '../../bower_components/jquery/jquery',
        bootstrap: '../../bower_components/bootstrap/dist/js/bootstrap',
        requirejs: '../../bower_components/requirejs/require',
        'backbone-amd': '../../bower_components/backbone-amd/backbone',
        'd3-amd': '../../bower_components/d3-amd/d3',
        'requirejs-domready': '../../bower_components/requirejs-domready/domReady',
        'requirejs-text': '../../bower_components/requirejs-text/text',
        'underscore-amd': '../../bower_components/underscore-amd/underscore'
    },
    map: {
        '*': {
            text: 'requirejs-text',
            domReady: 'requirejs-domready',
            underscore: 'underscore-amd',
            backbone: 'backbone-amd',
            d3: 'd3-amd'
        }
    },
    shim: {
        jquery: {
            exports: '$'
        },
        bootstrap: {
            deps: [
                'jquery'
            ]
        },
        'underscore-amd': {
            exports: '_'
        },
        'backbone-amd': {
            deps: [
                'underscore-amd',
                'jquery'
            ],
            exports: 'Backbone'
        },
        'd3-amd': {
            exports: 'd3'
        }
    }
});

require(['app'], function(App) {
    App.initialize();
})
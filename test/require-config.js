
requirejs.config({
    baseUrl : '../src/js',
    paths : {
        pviz : '.',
        pviz_templates : '../templates',
        jquery : '../../bower_components/jquery/jquery',
        bootstrap : '../../bower_components/bootstrap/dist/js/bootstrap',
        requirejs : '../../bower_components/requirejs/require',
        'backbone' : '../../bower_components/backbone-amd/backbone',
        'd3' : '../../bower_components/d3/d3',
        'domReady' : '../../bower_components/requirejs-domready/domReady',
        'text' : '../../bower_components/requirejs-text/text',
        'underscore' : '../../bower_components/underscore-amd/underscore',

        suites : '../../test/suites',
        sinon : '../../test/lib/sinon-1.4.2',
        resources : '../../test/resources'
    },
    shim : {
        bootstrap : {
            deps : ['jquery']
        },
        d3 : {
            exports : 'd3'
        },
        sinon : {
            exports : 'sinon'
        }
    }
});


// Author: Thomas Davis <thomasalwyndavis@gmail.com>
// Filename: main.js

// Require.js allows us to configure shortcut alias
// Their usage will become more apparent futher along in the tutorial.
requirejs.config({
    baseUrl : '../src/js',
    paths : {
        pviz : './',
        jQuery : '../lib/jquery-1.8.3.min',
        underscore : '../lib/underscore-min',
        backbone : '../lib/backbone-min',
        d3 : '../lib/d3.v3.min',
        bootstrap : '../lib/bootstrap.min',

        text : '../lib/require/text',
        domReady : '../lib/require/domReady',

        suites : '../../test/suites',
        sinon : '../../test/lib/sinon-1.4.2',
        resources : '../../test/resources',

        pviz_templates:'../templates'
    },
    shim : {
        'jQuery' : {
            exports : '$'
        },
        'underscore' : {
            exports : '_'
        },
        'backbone' : {
            //These script dependencies should be loaded before loading
            //backbone.js
            deps : ['underscore', 'jQuery'],
            //Once loaded, use the global 'Backbone' as the
            //module value.
            exports : 'Backbone'
        },
        d3 : {
            exports : 'd3'
        },
        sinon : {
            exports : 'sinon'
        }

    }
});

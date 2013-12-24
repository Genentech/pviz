{  
    appUrl : '..',
    baseUrl : '../src/js',
    include : ['PVizExport'],
    wrap : {
        startFile : 'start.frag.txt',
        endFile : 'end.frag.txt'
    },

    out : '../dist/pviz-bundle-min.js',
    optimize: "uglify",
//        exclude : ['jQuery', 'backbone', 'underscore', 'd3'],
    paths:{
  pviz: '.',
    pviz_templates: '../templates',
    jquery: '../../bower_components/jquery/jquery',
    bootstrap: '../../bower_components/bootstrap/dist/js/bootstrap',
    requirejs: '../../bower_components/requirejs/require',
    'backbone': '../../bower_components/backbone-amd/backbone',
    'd3': 'empty',//../../bower_components/d3/d3',
    'domReady': '../../bower_components/requirejs-domready/domReady',
    'text': '../../bower_components/requirejs-text/text',
    'underscore': '../../bower_components/underscore-amd/underscore'},
    shim : {
        'jquery' : {
            exports : '$'
        },
        'underscore' : {
            exports : '_'
        },
        'backbone' : {
            // These script dependencies should be loaded before loading
            // backbone.js
            deps : ['underscore', 'jquery'],
            // Once loaded, use the global 'Backbone' as the
            // module value.
            exports : 'Backbone'
        },
        d3 : {
            exports : 'd3'
        }
    }
}


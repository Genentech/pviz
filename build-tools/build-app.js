//bundles modules exported via PVizExport classes
( {
    appDir : "../src",
    baseUrl : "js",
    dir : "../target/build",
    name : 'app',
    fileExclusionRegExp : /^\.(svn|\.DS_Store)$/i,
    paths : {
        pviz : '.', 
        jQuery : '../lib/jquery-1.8.3.min',
        underscore : '../lib/underscore-min',
        backbone : '../lib/backbone-min',
        d3 : '../lib/d3.v3.min',
        bootstrap : '../lib/bootstrap.min',
        text : '../lib/require/text',
        domReady : '../lib/require/domReady',

        //        'msms-js-lib' : '../include/msms-js-lib/js',
        pviz_templates : '../templates'

    },
    uglify : {
        toplevel : true,
        ascii_only : true,
        beautify : true,
        max_line_length : 1000,

        //How to pass uglifyjs defined symbols for AST symbol replacement,
        //see "defines" options for ast_mangle in the uglifys docs.
        defines : {
            DEBUG : ['name', 'false']
        },

        //Custom value supported by r.js but done differently
        //in uglifyjs directly:
        //Skip the processor.ast_mangle() part of the uglify call (r.js 2.0.5+)
        no_mangle : true
    },
    shim : {
        'jQuery' : {
            exports : '$'
        },
        'underscore' : {
            exports : '_'
        },
        'backbone' : {
            deps : ['underscore', 'jQuery'],
            exports : 'Backbone'
        },
        bootstrap : {
            deps : ['jQuery'],
            exports : 'bootstrap'
        },
        d3 : {
            exports : 'd3'
        }

    },
    optimizeCss : "standard.keepLines"
})
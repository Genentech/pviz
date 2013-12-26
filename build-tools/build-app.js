//bundles modules exported via PVizExport classes
( {
    appDir : "../src",
    baseUrl : "js",
    dir : "../target/build",
    name : 'app',
    fileExclusionRegExp : /^\.(svn|\.DS_Store)$/i,
    paths : {
        pviz : '.',
        pviz_templates : '../templates',
        jquery : '../../bower_components/jquery/jquery',
        bootstrap : '../../bower_components/bootstrap/dist/js/bootstrap',
        requirejs : '../../bower_components/requirejs/require',
        'backbone' : '../../bower_components/backbone-amd/backbone',
        'd3' : '../../bower_components/d3/d3.min',
        'domReady' : '../../bower_components/requirejs-domready/domReady',
        'text' : '../../bower_components/requirejs-text/text',
        'underscore' : '../../bower_components/underscore-amd/underscore'
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
        bootstrap : {
            deps : ['jquery']
        },
        d3 : {
            exports : 'd3'
        }

    },
    optimizeCss : "standard.keepLines"
})
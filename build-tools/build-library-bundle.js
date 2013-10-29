{  
        appUrl : '..',
        baseUrl : '../src/js',
        include : ['PVizExport'],
        wrap : {
            startFile : 'start.frag.txt',
            endFile : 'end.frag.txt'
        },

        out : '../dist/pviz-bundle-min.js',
        optimize: "none",
//        exclude : ['jQuery', 'backbone', 'underscore', 'd3'],

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
    }


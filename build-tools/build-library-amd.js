{ appUrl : '..',
    baseUrl : '../src/js',
    include : ['PVizExport'],
 wrap : {
            startFile : 'start-amd.frag.txt',
            endFile : 'end-amd.frag.txt'
        },
    out : '../dist/pviz-amd-min.js',
    optimize: "none",
    //        exclude : ['jQuery', 'backbone', 'underscore', 'd3'],

    paths : { pviz : '.',
        pviz_templates : '../templates',

        jQuery : 'empty:',
        underscore : 'empty:',
        backbone : 'empty:',
        d3 : 'empty:',
        bootstrap : 'empty:',
        text : '../lib/require/text',
        domReady : '../lib/require/domReady'
    }
}


module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        //testing a commit line
        pkg : grunt.file.readJSON('bower.json'),
        src_files : ['src/js/**/*.js', '!src/js/*.js'],
        copyright : "build-tools/copyright.txt",
        jshint : {
            all : {
                files : {
                    src : ['<%= src_files %>']
                }
            },
            options : {
                // options here to override JSHint defaults
                globals : {
                    jQuery : true,
                    console : true,
                    module : true,
                    document : true
                }
            }
        },
        bower : {
            target : {
                rjsConfig : 'src/js/main.js'
            }
        },
        clean : {
            'default' : ['build/*', 'dist/*']
        },
        requirejs : {
            'compile-bundle' : {
                options : {
                    almond:true,
                    name : "app",
                    
                    baseUrl : "src/js",
                    mainConfigFile : "src/js/main.js",
                    out : "build/<%= pkg.name %>-bundle.js",
                    optimize : 'none',
                    include : ['PVizExport'],
                    exclude : [],
                    wrap : {
                        startFile : "build-tools/start.frag.txt",
                        endFile : "build-tools/end.frag.txt"
                    }
                }
            },
            'compile-bundle-min' : {
                options : {
                    almond:true,
                    name : "app",
                    
                    baseUrl : "src/js",
                    mainConfigFile : "src/js/main.js",
                    out : "build/<%= pkg.name %>-bundle.min.js",
                    include : ['PVizExport'],
                    exclude : [],
                    wrap : {
                        startFile : "build-tools/start.frag.txt",
                        endFile : "build-tools/end.frag.txt"
                    }
                }
            },
            'compile-amd-module' : {
                options : {
                    name : "PVizExport",
                    baseUrl : "src/js",
                    mainConfigFile : "src/js/main.js",
                    out : "build/<%= pkg.name %>-amd.js",
                    exclude : ['jquery', 'underscore', 'backbone', 'd3', 'bootstrap', 'domReady', 'text'],
                    optimize : "none",
                    wrap : {
                        endFile : "build-tools/amd-module-end.txt"
                    }
                }
            },
            'compile-amd-module-min' : {
                options : {
                    name : "PVizExport",
                    baseUrl : "src/js",
                    mainConfigFile : "src/js/main.js",
                    out : "build/<%= pkg.name %>-amd.min.js",
                    exclude : ['jquery', 'underscore', 'backbone', 'd3', 'bootstrap', 'domReady', 'text'],
                    wrap : {
                        endFile : "build-tools/amd-module-end.txt"
                    },
                    preserveLicenseComments : false
                }
            }
        },
        concat : {
            options : {
                separator : '\n',
                banner : '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            concat_copyright : {
                files : {
                    'build/<%= pkg.name %>-amd.js' : ["<%= copyright %>", 'build/<%= pkg.name %>-amd.js'],
                    'build/<%= pkg.name %>-amd.min.js' : ["<%= copyright %>", 'build/<%= pkg.name %>-amd.min.js'],
                    'build/<%= pkg.name %>-bundle.js' : ["<%= copyright %>", 'build/<%= pkg.name %>-bundle.js'],
                    'build/<%= pkg.name %>-bundle.min.js' : ["<%= copyright %>", 'build/<%= pkg.name %>-bundle.min.js']
                }
            }
        },
        devserver : {
            server : {
                base : "./src"
            }
        },
        watch : {
            files : ['Gruntfile.js', 'src/js/main.js'],
            tasks : ['build']
        },
        copy : {
            dist : {
                src : ['build/pviz-*.*','src/css/pviz-core.css'],
                dest : 'dist/',
                flatten:true,
                expand:true
            },
            'dist-examples' : {
                src : ['build/pviz-bundle.min.js','src/css/pviz-core.css', 'bower_components/bootstrap/dist/css/bootstrap*.min.css'],
                dest : 'examples/deps',
                flatten:true,
                expand:true
            }
        },
        "mocha-server": {
            'default': {
                src: 'test/suites/**/*.js',
                options: {
                    ui: 'bdd',
                    require: [
                        'should',
                    ]
                }
            }
        },
        jsdoc : {
            dist : {
                src: ['src/js/**/*.js'],
                options: {
                    destination: 'examples/doc',
                    private:false
                }
            }
        }

    });

    // Load the plugin that provides tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-server-mocha');
    //grunt.loadNpmTasks('grunt-bower-requirejs');
    grunt.loadNpmTasks('grunt-requirejs');
    grunt.loadNpmTasks('grunt-devserver');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-jsdoc');

    // Default task(s).
    grunt.registerTask('build_x', ['requirejs', 'concat:concat_copyright']);
    grunt.registerTask('default', ['build']);
    grunt.registerTask('test', ['mocha-server']);

    grunt.registerTask('build', ['build_x', 'copy:dist', 'copy:dist-examples', 'jsdoc']);

};

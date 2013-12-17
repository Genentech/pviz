module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('bower.json'),
		src_files: ['src/js/**/*.js', '!src/js/*.js'],
		copyright: "build-tools/copyright.txt",
		jshint: {
		  all: {
			files: { src: ['<%= src_files %>']}
		  },
		  options: {
			// options here to override JSHint defaults 
			globals: {
			  jQuery: true,
			  console: true,
			  module: true,
			  document: true
			}
		  }
		},
		bower: {
			target: {
				rjsConfig: 'src/js/main.js'
			}
		},
		requirejs: {
			'compile-bundle': {
				options: {
					name: "app",
					baseUrl: "src/js",
					mainConfigFile: "src/js/main.js",
					out: "build/<%= pkg.name %>-bundle.js",
					optimize: 'none'
				}
			},
			'compile-amd-module': {
				options: {
					name: "PVizExport",
					baseUrl: "src/js",
					mainConfigFile: "src/js/main.js",
					out: "build/<%= pkg.name %>-amd.js",
					exclude: ['jquery', 'underscore', 'backbone', 'd3', 'bootstrap', 'domReady', 'text'],
					optimize: "none",
					wrap: {
						endFile: "build-tools/amd-module-end.txt"
					}
				}
			},
			'compile-bundle-min': {
				options: {
					name: "app",
					baseUrl: "src/js",
					mainConfigFile: "src/js/main.js",
					out: "build/<%= pkg.name %>-bundle.min.js"
				}
			},
			'compile-amd-module-min': {
				options: {
					name: "PVizExport",
					baseUrl: "src/js",
					mainConfigFile: "src/js/main.js",
					out: "build/<%= pkg.name %>-amd.min.js",
					exclude: ['jquery', 'underscore', 'backbone', 'd3', 'bootstrap', 'domReady', 'text'],
					wrap: {
						endFile: "build-tools/amd-module-end.txt"
					},
					preserveLicenseComments: false
				}
			}
		},
		concat: {
			options: {
				separator: '\n',
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			concat_copyright:{
				files: {
					'build/<%= pkg.name %>-amd.js': ["<%= copyright %>", 'build/<%= pkg.name %>-amd.js'],
					'build/<%= pkg.name %>-amd.min.js': ["<%= copyright %>", 'build/<%= pkg.name %>-amd.min.js'],
					'build/<%= pkg.name %>-bundle.js': ["<%= copyright %>", 'build/<%= pkg.name %>-bundle.js'],
					'build/<%= pkg.name %>-bundle.min.js': ["<%= copyright %>", 'build/<%= pkg.name %>-bundle.min.js']
				}
			}
		},
		devserver: {
			server: {
				base: "./src"
			}
		},
		watch: {
		  files: ['Gruntfile.js', 'src/js/main.js'],
		  tasks: ['build']
		}
	});

	// Load the plugin that provides tasks.
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-bower-requirejs');
	grunt.loadNpmTasks('grunt-requirejs');
	grunt.loadNpmTasks('grunt-devserver');
	grunt.loadNpmTasks('grunt-contrib-concat');
	
	// Default task(s).
	grunt.registerTask('build', ['requirejs', 'concat:concat_copyright']);
	grunt.registerTask('default', ['build']);

};
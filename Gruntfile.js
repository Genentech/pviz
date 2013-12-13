module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('bower.json'),
		src_files: ['src/js/**/*.js', '!src/js/*.js'],
		uglify: {
		  options: {
			banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
		  },
		  build: {
			src: '<%= src_files %>',
			dest: 'build/<%= pkg.name %>.min.js'
		  }
		},
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
		watch: {
		  files: ['Gruntfile.js', 'src/js/main.js'],
		  tasks: ['requirejs:compile-bundle', 'requirejs:compile-amd-module']
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
					optimize: 'none'
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
					exclude: ['jquery', 'underscore', 'backbone', 'd3', 'bootstrap', 'domReady', 'text']
				}
			}
		},
		devserver: {
			server: {
				base: "./src"
			}
		}
	});

	// Load the plugin that provides tasks.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-bower-requirejs');
	grunt.loadNpmTasks('grunt-requirejs');
	grunt.loadNpmTasks('grunt-devserver');
	
	// Default task(s).
	grunt.registerTask('default', ['uglify']);

};
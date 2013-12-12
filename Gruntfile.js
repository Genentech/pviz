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
		  files: ['<%= src_files %>'],
		  tasks: ['uglify']
		},
		bower: {
			target: {
				rjsConfig: 'src/js/main.js'
			}
		},
		devserver: {
			server: {
				base: "src"
			}
		}
	});

	// Load the plugin that provides tasks.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-bower-requirejs');
	grunt.loadNpmTasks('grunt-devserver');
	
	// Default task(s).
	grunt.registerTask('default', ['uglify']);

};
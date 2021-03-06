module.exports = function(grunt) {

    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'src/<%= pkg.name %>.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        },
        mochaTest: {
            test: {
                options: {
                },
                src: [ 'test/**/*.js' ]
            }
        }
    });

    // Load the plugin that provides the 'uglify' task
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-mocha-test');

    // Default tasks
    grunt.registerTask('default', ['uglify', 'mochaTest']);
};


module.exports = function (grunt) {
grunt.loadNpmTasks('grunt-browserify');
grunt.loadNpmTasks('grunt-mocha-test');

grunt.initConfig({
    browserify: {
        dist: {
            src: './src/orbit-simple-2d.js',
            dest: 'build/orbit-simple-2d.js',
            options: {
                keepalive: true,
                watch: true
            },
        },
        ex: {
            src: './src/orbit-example.js',
            dest: 'build/orbit-example.js'
        }
    },
    mochaTest: {
        test: {
            options: {
                reporter: 'spec',
                captureFile: 'test/results.txt', // Optionally capture the reporter output to a file
                quiet: false, // Optionally suppress output to standard out (defaults to false)
                clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
            },
        src: ['test/**/*.js']
      }
    }

});

grunt.registerTask('test', ['mochaTest']);
grunt.registerTask('default', ['browserify']);

};
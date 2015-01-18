module.exports = function (grunt) {
grunt.loadNpmTasks('grunt-browserify');
grunt.loadNpmTasks('grunt-mocha');

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
    mocha: {
        test: {
            src: ['test/**/*.html'],
        },
        options: {
            run: true
        }
    }
});

grunt.registerTask('test', ['mocha']);
grunt.registerTask('default', ['browserify']);

};
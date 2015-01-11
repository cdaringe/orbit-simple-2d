module.exports = function (grunt) {
grunt.loadNpmTasks('grunt-browserify');

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
    }
});

grunt.registerTask('default', ['browserify']);

};
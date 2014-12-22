module.exports = function (grunt) {

grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-watchify');

grunt.initConfig({
    watch: {
        app: {
            files: './src/**/*.js',
            options: {}
        }
    },
    watchify: {
        options: {
            // defaults options used in b.bundle(opts)
            // detectGlobals: true,
            // insertGlobals: false,
            // ignoreMissing: false,
            // debug: false,
            // standalone: false,
            // keepalive: true,
            // callback: function(b) {
            //     // configure the browserify instance here
            //     b.add();
            //     b.require();
            //     b.external();
            //     b.ignore();
            //     b.transform();

            //     // return it
            //     return b;
            // }
        },
        dist: {
            src: './src/orbit-simple-2d.js',
            dest: 'build/orbit-simple-2d.js'
        },
        ex: {
            src: './src/orbit-example.js',
            dest: 'build/orbit-example.js'
        }
    }
});

grunt.registerTask('default', ['watchify', 'watch']);

};
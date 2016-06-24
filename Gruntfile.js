var path = require('path');

module.exports = function (grunt) {

    grunt.initConfig({

        watch: {
            content: {
                files: [
                    'views/**/*.js*',
                    'app.js',
                    'index.html',
                    'main.js',
                    'renderer.js',
                    'core/*.js*'
                ],
                options: {
                    livereload: true
                }
            },
            less: {
                files: 'less/**/*.less',
                tasks: ['less:dev'],
                options: {
                    livereload: true
                }
            }
        },

        less: {
            dev: {
                options: {
                    relativeUrls: true
                },
                files: {
                    "dist/bootstrap-material-design.css": "less/bootstrap-material-design/bootstrap-material-design.less",
                    "dist/ripples.css": "less/bootstrap-material-design/ripples.less",
                    "dist/roboto.css": "less/roboto.less",
                    "dist/material-icons.css": "less/material-icons.less",
                    "dist/app.css": "less/app.less"
                }
            },
            dist: {
                options: {
                    compress: true,
                    relativeUrls: true
                },
                files: {
                    "dist/bootstrap-material-design.min.css": "less/bootstrap-material-design/bootstrap-material-design.less",
                    "dist/ripples.min.css": "less/bootstrap-material-design/ripples.less",
                    "dist/roboto.min.css": "less/roboto.less",
                    "dist/material-icons.min.css": "less/material-icons.less",
                    "dist/app.min.css": "less/app.less"
                }
            }
        },

        symlink: {
            fonts: {
                target: '../less/fonts',
                link: 'dist/fonts'
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-symbolic-link');

    grunt.registerTask('default', [
        'less:dev'
    ]);

    grunt.registerTask('serve', [
        'less:dev',
        'watch'
    ]);

    grunt.registerTask('dist', [
        'less:dist'
    ]);
};

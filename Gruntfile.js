var path = require('path');

module.exports = function (grunt) {

    grunt.initConfig({

        watch: {
            content: {
                files: [
                    'app/views/**/*.js*',
                    'app/index.html',
                    'app/main.js',
                    'app/renderer.js',
                    'app/core/*.js*'
                ],
                options: {
                    livereload: true
                }
            },
            less: {
                files: 'app/less/**/*.less',
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
                    "app/dist/bootstrap-material-design.css": "app/less/bootstrap-material-design/bootstrap-material-design.less",
                    "app/dist/ripples.css": "app/less/bootstrap-material-design/ripples.less",
                    "app/dist/roboto.css": "app/less/roboto.less",
                    "app/dist/material-icons.css": "app/less/material-icons.less",
                    "app/dist/app.css": "app/less/app.less"
                }
            },
            dist: {
                options: {
                    compress: true,
                    relativeUrls: true
                },
                files: {
                    "app/dist/bootstrap-material-design.min.css": "app/less/bootstrap-material-design/bootstrap-material-design.less",
                    "app/dist/ripples.min.css": "app/less/bootstrap-material-design/ripples.less",
                    "app/dist/roboto.min.css": "app/less/roboto.less",
                    "app/dist/material-icons.min.css": "app/less/material-icons.less",
                    "app/dist/app.min.css": "app/less/app.less"
                }
            }
        },

        symlink: {
            fonts: {
                target: '../less/fonts',
                link: 'app/dist/fonts'
            }
        }
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

'use strict';

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        config: {
            // Configurable paths
            dev: 'src',
            dist: 'dist',
            var: 'var',
            jsPath: 'scripts',
            stylesPath: 'styles',
            imgPath: 'images',
            cssFiles: 'css',
        },

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            js: {
                files: ['<%= config.dev %>/<%= config.jsPath %>/{,*/}*.js'],
                tasks: ['']
            },
            compass: {
                files: ['<%= config.dev %>/<%= config.stylesPath %>/{,*/}*.{scss,sass}'],
                tasks: ['compass:server', 'autoprefixer']
            },
            styles: {
                files: ['<%= config.dev %>/<%= config.stylesPath %>/{,*/}*.css'],
                tasks: ['newer:copy:styles', 'autoprefixer']
            }
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                livereload: 35729,
                // Change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '<%= config.var %>',
                        '<%= config.dev %>'
                    ]
                }
            },
            test: {
                options: {
                    port: 9001,
                    base: [
                        '<%= config.var %>',
                        'test',
                        '<%= config.dev %>'
                    ]
                }
            },
            dist: {
                options: {
                    open: true,
                    base: '<%= config.dist %>',
                    livereload: false
                }
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '<%= config.var %>',
                        '<%= config.dist %>/*',
                        '!<%= config.dist %>/.git*'
                    ]
                }]
            },
            server: '<%= config.var %>'
        },

        // Mocha testing framework configuration options
        mocha: {
            all: {
                options: {
                    run: true,
                    urls: ['http://<%= connect.test.options.hostname %>:<%= connect.test.options.port %>/index.html']
                }
            }
        },

        // Compiles Sass to CSS and generates necessary files if requested
        compass: {
            options: {
                sassDir: '<%= config.dev %>/<%= config.stylesPath %>',
                cssDir: '<%= config.var %>/<%= config.stylesPath %>',
                generatedImagesDir: '<%= config.var %>/<%= config.imgPath %>/generated',
                imagesDir: '<%= config.dev %>/<%= config.imgPath %>',
                javascriptsDir: '<%= config.dev %>/<%= config.jsPath %>',
                fontsDir: '<%= config.dev %>/<%= config.stylesPath %>/fonts',
                importPath: '<%= config.dev %>/bower_components',
                httpImagesPath: '<%= config.imgPath %>',
                httpGeneratedImagesPath: '/<%= config.imgPath %>/generated',
                httpFontsPath: '<%= config.stylesPath %>/fonts',
                relativeAssets: false,
                assetCacheBuster: false
            },
            dist: {
                options: {
                    generatedImagesDir: '<%= config.dist %>/<%= config.imgPath %>/generated'
                }
            },
            server: {
                options: {
                    debugInfo: true
                }
            }
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.var %>/<%= config.stylesPath %>/',
                    src: '{,*/}*.css',
                    dest: '<%= config.var %>/<%= config.stylesPath %>/'
                }]
            }
        },

        // Automatically inject Bower components into the HTML file
        'bower-install': {
            app: {
                html: '<%= config.dev %>/index.html',
                ignorePath: '<%= config.dev %>/'
            }
        },

        // Renames files for browser caching purposes
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= config.dist %>/<%= config.jsPath %>/{,*/}*.js',
                        '<%= config.dist %>/<%= config.stylesPath %>/{,*/}*.css',
                        '<%= config.dist %>/<%= config.imgPath %>/{,*/}*.{gif,jpeg,jpg,png,webp}',
                        '<%= config.dist %>/<%= config.stylesPath %>/fonts/{,*/}*.*'
                    ]
                }
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            options: {
                dest: '<%= config.dist %>'
            },
            html: '<%= config.dev %>/index.html'
        },

        // Performs rewrites based on rev and the useminPrepare configuration
        usemin: {
            options: {
                assetsDirs: ['<%= config.dist %>']
            },
            html: ['<%= config.dist %>/{,*/}*.html'],
            css: ['<%= config.dist %>/<%= config.stylesPath %>/{,*/}*.css']
        },

        // The following *-min tasks produce minified files in the dist folder
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.dev %>/<%= config.imgPath %>',
                    src: '{,*/}*.{gif,jpeg,jpg,png}',
                    dest: '<%= config.dist %>/<%= config.imgPath %>'
                }]
            }
        },
        htmlmin: {
            dist: {
                options: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeCommentsFromCDATA: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.dist %>',
                    src: '{,*/}*.html',
                    dest: '<%= config.dist %>'
                }]
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.dev %>',
                    dest: '<%= config.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        'images/{,*/}*.webp',
                        '{,*/}*.html',
                        '<%= config.stylesPath %>/fonts/{,*/}*.*'
                    ]
                },{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.var %>',
                    dest: '<%= config.dist %>',
                    src: [
                        '<%= config.stylesPath %>/{,*/}*.css'
                    ]
                }]
            },
            styles: {
                expand: true,
                dot: true,
                cwd: '<%= config.dev %>/<%= config.stylesPath %>/',
                dest: '<%= config.var %>/<%= config.stylesPath %>/',
                src: '{,*/}*.css'
            }
        },


        // Generates a custom Modernizr build that includes only the tests you
        // reference in your app
        modernizr: {
            devFile: '<%= config.dev %>/bower_components/modernizr/modernizr.js',
            outputFile: '<%= config.dist %>/bower_components/modernizr/modernizr.js',
            files: [
                '<%= config.dist %>/<%= config.jsPath %>/{,*/}*.js',
                '<%= config.dist %>/<%= config.stylesPath %>/{,*/}*.css',
                '!<%= config.dist %>/<%= config.jsPath %>/vendor/*'
            ],
            uglify: true
        },

        // Run some tasks in parallel to speed up build process
        concurrent: {
            server: [
                'compass:server',
                'copy:styles'
            ],
            test: [
                'copy:styles'
            ],
            dist: [
                'compass',
                'copy:styles',
                'imagemin'
            ]
        }
    });


    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'concurrent:server',
            'autoprefixer',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('test', function(target) {
        if (target !== 'watch') {
            grunt.task.run([
                'clean:server',
                'concurrent:test',
                'autoprefixer',
            ]);
        }

        grunt.task.run([
            'connect:test',
            'mocha'
        ]);
    });

    grunt.registerTask('build', [
        'clean:dist',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'concat',
        'cssmin',
        'uglify',
        'copy:dist',
        'modernizr',
        'rev',
        'usemin',
        'htmlmin'
    ]);

    grunt.registerTask('default', [
        'test',
        'build'
    ]);
};

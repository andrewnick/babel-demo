/*!
 * FireShell Gruntfile
 * http://getfireshell.com
 * @author Todd Motto
 */

'use strict';

/**
 * Grunt module
 */
module.exports = function (grunt) {

  /**
   * Dynamically load npm tasks
   */
  require('time-grunt')(grunt);
  //require('load-grunt-tasks')(grunt);
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  var webpack = require('webpack');

  /**
   * Grunt config
   */
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    /**
     * Set project info
     */
    project: {
      src: 'src',
      app: 'dist',
      assets: '<%= project.app %>',
      css: [
        '<%= project.src %>/scss/styles.scss'
      ],
      js: [
        '<%= project.src %>/js/*.js'
      ]
    },

    /**
     * Project banner
     * Dynamically appended to CSS/JS files
     * Inherits text from package.json
     */
    tag: {
      banner: '/*!\n' +
              ' * <%= pkg.name %>\n' +
              ' * <%= pkg.title %>\n' +
              ' * <%= pkg.url %>\n' +
              ' * @author <%= pkg.author %>\n' +
              ' * @version <%= pkg.version %>\n' +
              ' * Copyright <%= pkg.copyright %>. <%= pkg.license %> licensed.\n' +
              ' */\n'
    },

    /**
     * Clean files and folders
     * https://github.com/gruntjs/grunt-contrib-clean
     * Remove generated files for clean deploy
     */
    clean: {
      dist: [
        '<%= project.assets %>/css/styles.unprefixed.css',
        '<%= project.assets %>/css/styles.prefixed.css'
      ]
    },

     /**
     * Webpack - with babel
     * Convert ES6 to ES5 and build with webpack
     * https://github.com/webpack/grunt-webpack
     */
    webpack: {
      dev: {
        entry: './<%= project.src %>/js/main.js',
        output: {
            path: '<%= project.assets %>/js',
            filename: 'scripts.js'
        },
        module: {
            loaders: [
                {test: '<%= project.src %>/js', loader: 'babel-loader'}
            ]
        },
        //keepalive: true,
        stats: {
            // Nice colored output
            colors: true
        },
        resolve: {
          modulesDirectories: ['node_modules', 'web_modules', 'dist/components', 'static']
        },
        amd: {
                $: true
        },
        plugins: [
            new webpack.ResolverPlugin(
                new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])
            ),
            new webpack.ProvidePlugin({
                 $: "jquery",
                 jQuery: "jquery"
             })
        ]
        // Create Sourcemaps for the bundle
        //devtool: 'source-map'
      }
    },

    /**
     * Uglify (minify) JavaScript files
     * https://github.com/gruntjs/grunt-contrib-uglify
     * Compresses and minifies all JavaScript files into one
     */
    uglify: {
      options: {
        banner: '<%= tag.banner %>'
      },
      dist: {
        files: {
          '<%= project.assets %>/js/scripts.min.js': '<%= project.assets %>/js/scripts.js'
        }
      }
    },

    /**
     * Compile Sass/SCSS files
     * https://github.com/gruntjs/grunt-contrib-sass
     * Compiles all Sass/SCSS files and appends project banner
     */
    sass: {
      dev: {
        options: {
          style: 'expanded',
          banner: '<%= tag.banner %>'
        },
        files: {
          '<%= project.assets %>/css/styles.unprefixed.css': '<%= project.css %>'
        }
      },
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          '<%= project.assets %>/css/style.unprefixed.css': '<%= project.css %>'
        }
      }
    },

    /**
    * Compile Sass using compass
    * https://github.com/gruntjs/grunt-contrib-compass
    * Compiles all Sass and appends banner
    */
    compass: {
      dev: {
        options: {
          sassDir: '<%= project.src %>/scss',
          cssDir: '<%= project.assets %>/css',
          require: ['susy','breakpoint']

        }
      }
    },

    postcss: {
      options: {
        map: false,
        processors: [
          require('pixrem')(), // add fallbacks for rem units
          require('autoprefixer-core')({
              browsers: [
                'last 1 version',
                'safari 6',
                'ie 9',
                'ios 6',
                'android 4'
              ]
          }),
          require('postcss-normalize'),
          require('cssnano')() // minify the result
        ]
      },
      dev: {
        files: {
          '<%= project.assets %>/css/styles.min.css': [
            '<%= project.assets %>/css/styles.css'
          ]
        }
      },
      dist: {
        files: {
          '<%= project.assets %>/css/styles.min.css': [
            '<%= project.assets %>/css/styles.css'
          ]
        }
      }
    },

    /**
     * Build bower components
     * https://github.com/yatskevich/grunt-bower-task
     */
    bower: {
      dev: {
        dest: '<%= project.assets %>/components/'
      },
      dist: {
        dest: '<%= project.assets %>/components/'
      }
    },

    /**
     * Runs tasks against changed watched files
     * https://github.com/gruntjs/grunt-contrib-watch
     * Watching development files and run concat/compile tasks
     * Livereload the browser once complete
     */
    watch: {
      configFiles: {
        files: 'Gruntfile.js',
        options: {
          reload: true
        }
      },
      webpack: {
        files: '<%= project.src %>/js/{,*/}*.js',
        tasks: ['webpack:dev']
      },
      uglify: {
        files: '<%= project.assets %>/js/scripts.js',
        tasks: ['uglify:dist']
      },
      compass: {
        files: '<%= project.src %>/scss/{,*/}*.{scss,sass}',
        tasks: ['compass:dev', 'postcss:dev']
      }
    }
  });

  /**
   * Default task
   * Run `grunt` on the command line
   */
  grunt.registerTask('default', [
    'compass:dev',
    'bower:dev',
    'postcss:dev',

    // 'jshint',
    'webpack:dev',
    'uglify:dist',
    //'concat:dev',
    'watch'
  ]);

  /**
   * Build task
   * Run `grunt build` on the command line
   * Then compress all JS/CSS files
   */
  grunt.registerTask('build', [
    'sass:dist',
    'bower:dist',
    'postcss:dist',
    'clean:dist',
    'jshint',
    'uglify'
  ]);

};

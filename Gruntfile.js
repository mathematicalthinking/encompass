/** # Grunt Configuration
 * @description We are using [Grunt](http://gruntjs.com/) the Javascript Task Runner
 *              for building and compiling the app. Below is the configuration.
 * @see [Grunt](http://gruntjs.com/)
 * @authors Amir Tahvildaran <amir@mathforum.org>
 * @since 1.0.0
*/

/*jshint camelcase: false */
/*global module:false */
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    revision: process.env.SVN_REVISION || '??',
    build: process.env.BUILD_NUMBER || '??',
    uglify: {
      application: {
        options: {
          banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                  '<%= grunt.template.today("yyyy-mm-dd") %> - ' +
                  'r<%= revision %> - build:<%= build %> */'
        },
        files: {
          'dist/application-<%= pkg.version %>-min.js': 'build/application-prod.js'
        }
      }
    },

    /*
       A simple ordered concatenation strategy.
       This will start at app/app.js and begin
       adding dependencies in the correct order
       writing their string contents into
       'build/application.js'

       Additionally it will wrap them in evals
       with @ sourceURL statements so errors, log
       statements and debugging will reference
       the source files by line number.

       You would set this option to false for
       production.
    */
    neuter: {
      dev: {
        options: {
          includeSourceURL: true
        },
        src: 'app/app.js',
        dest: 'build/application.js'
      },
      prod: {
        src: 'app/app.js',
        dest: 'build/application-prod.js'
      }
    },

    /*
      Browserify is similar to neuter
      We should probably choose one but javascript
      modules are just insane at the moment (RequireJS, AMD, ...)
    */
    browserify: {
      options: {
        browserifyOptions: {debug: true}
      },
      main: {
        src: 'common/browser.js',
        dest: 'build/common_bundle.js'
      }
    },

    /*
      Watch files for changes.

      Not spawning a new grunt task speeds this up quite a bit
    */
    watch: {
      common_code: {
        files: ['common/**/*.js'],
        tasks: ['browserify', 'tests', 'jshint'], //common code is used on the front and backend
        options: {spawn: false }
      },
      common_files: {
        files: ['.jshintrc', 'Gruntfile.js'],
        tasks: ['jshint'], //anything could have changed in the Gruntfile
        options: { spawn: false }
      },
      ember_code: {
        files: ['app/**/*.js', 'dependencies/**/*.js', '!dependencies/compiled/templates.js', '!app/datasource/**', '!app/server.js', '!app/passport.js', '!app/config.js'],
        tasks: ['neuter:dev', 'jshint'], //jqunit
        options: { spawn: false }
      },
      server_code: {
        files: ['app/server.js', 'app/passport.js', 'app/fake_login.js', 'app/config.js', 'app/datasource/**/*.js'],
        tasks: ['jshint'], //nodemon monitors it's own files,
        options: { spawn: false }
      },
      handlebars_templates: {
        files: ['app/**/*.hbs'],
        tasks: ['emberTemplates', 'neuter:dev'], //jqunit
        options: { spawn: false }
      },
      common_tests: {
        files: ['test/jasmine/common/**'],
        tasks: ['jasmine:common', 'jshint'],
        options: { spawn: false }
      },
      ember_qunit: {
        files: ['test/qunit/**/*.*', 'test/data/fixtures.js'],
        tasks: ['jshint'], //jqunit
        options: { spawn: false }
      },
      //ember_casper: {
      //  files: ['test/casper/**/*.js'],
      //  tasks: ['mocha_casperjs', 'jshint'],
      //  options: { spawn: false }
      //}
    },

    /*
       Runs all files found in the test/ directory through PhantomJS.
       Prints the report in your terminal.
    */
    jasmine: {
      common: {
        src: 'build/common_bundle.js',
        options: {
          specs: ['test/jasmine/common/**/*_spec.js'],
          junit: {
            path: 'build/.test'
          },
          //display: 'short',
          summary: false, //https://github.com/gruntjs/grunt-contrib-jasmine/issues/145
          keepRunner: true
        }
      }
    },

    /*
      Also run jasmine-node for mongoose unit tests
    */
    jasmine_node: {
      projectRoot: '.',
      specNameMatcher: 'jade',
      requirejs: false,
      forceExit: true,
      jUnit: {
        report: false,
        savePath: 'build/reports/jasmine',
        useDotNotation: true,
        consolidate: true
      }
    },

    /*
      Also run qunit because thats already integrated with ember integration tests
    */
    qunit: {
      all: ['test/qunit/q*html'],
      options: {
        console: false //like to use 0.5.0 https://github.com/gruntjs/grunt-contrib-qunit/issues/68
      }
    },

    /*
      Generate junit reports from qunit runs
    */
    qunit_junit: {
      options: {
        dest: 'build/.test'
      }
    },

    mocha_casperjs: {
      options: {
        // Task-specific options go here.
      },
      files: {
        //src: ['test/casper/users.js']
        src: ['test/casper/*.js']
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
        },
        src: ['test/mocha/*.js']
      }
    },

    /*
      Reads the projects .js files and generates documentation in the docs folder
    */
    groc: {
      javascript: ['app/**/*.js', 'test/**/*.js', 'common/**/*.js', 'dependencies/selection-highlighting.js', '*.md', 'docs/*.md'],
      options: {
        out: 'build/docs/',
        except: ['test/qunit/support/*.*']
      }
    },

    /*
      Reads the projects .jshintrc file and applies coding
      standards. Doesn't lint the dependencies or test
      support files.
    */
    jshint: {
      all: ['Gruntfile.js', 'app/**/*.js', 'test/**/*.js', '!dependencies/*.*', '!test/qunit/support/*.*'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    /*
      Finds Handlebars templates and precompiles them into functions.
      The provides two benefits:

      1. Templates render much faster
      2. We only need to include the handlebars-runtime microlib
      and not the entire Handlebars parser.

      Files will be written out to dependencies/compiled/templates.js
      which is required within the project files so will end up
      as part of our application.

      The compiled result will be stored in
      Ember.TEMPLATES keyed on their file path (with the 'app/templates' stripped)
    */
    emberTemplates: {
      options: {
        templateName: function(sourceFile) {
          return sourceFile.replace(/app\/templates\//, '');
        },
        templateCompilerPath: 'dependencies/ember-template-compiler2_14_1.js'
      },
      'dependencies/compiled/templates.js': ["app/templates/**/*.hbs"]
    },

    nodemon: {
      dev: {
        script: 'app/server.js',
        options: {
          watch: ['app/server.js', 'app/passport.js', 'config.json', 'app/config.js', 'app/datasource', 'build/common_bundle.js', 'Gruntfile.js']
        }
      },
      debug: {
        script: 'app/server.js',
        options: {
          nodeArgs: ['--debug'],
          watch: ['app/server.js', 'app/passport.js', 'config.json', 'app/config.js', 'app/datasource', 'build/common_bundle.js', 'Gruntfile.js']
        }
      }
    },

    'node-inspector': {
      custom: {
        options: {
          'web-port': 8081
        }
      }
    },

    /**
     * Run nodemon and watch concurrently (in one tab)
    */
    concurrent: {
      dev: {
        tasks: ['nodemon:dev', 'tests', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      },
      'debug-only': {
        tasks: ['nodemon:debug', 'node-inspector'],
        options: {
          logConcurrentOutput: true
        }
      },
      debug: {
        tasks: ['nodemon:debug', 'node-inspector', 'tests', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-qunit-junit');
  grunt.loadNpmTasks('grunt-neuter');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-ember-templates');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-node-inspector');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.loadNpmTasks('grunt-mocha-casperjs');
  grunt.loadNpmTasks('grunt-mocha-test');
  //grunt.loadNpmTasks('grunt-casperjs-plugin');
  grunt.loadNpmTasks('grunt-groc');

  /*
    Build the application
      - convert all the handlebars templates into compile functions
      - convert the common code into a single bundle
      - combine these files + application files in order
  */
  grunt.registerTask('build', ['emberTemplates', 'browserify', 'neuter']);

  /*
    Wrapper for qunit that also stores the results in jUnit format
  */
  // TODO: rework qunit tests for ember 2 and add qunit back in
  //grunt.registerTask('jqunit', ['qunit_junit', 'qunit']);
  grunt.registerTask('jqunit', ['qunit_junit']);

  /*
    Execute all of the tests (jshint too)
  */
  grunt.registerTask('tests', ['jshint', 'jasmine', 'mochaTest']); // jqunit

  grunt.registerTask('integration-tests', ['mocha_casperjs', 'jasmine_node']);

  /*
    Build and then test
  */
  grunt.registerTask('test', ['build', 'tests']);

  /*
    Package the app up for distribution
      - build/test
      - minify and version stamp the application
      - build the docs
  */
  grunt.registerTask('dist', ['test', 'uglify', 'groc']);

  /*
    Default task. Build and then concurrently
      - start the server
      - run the tests
      - watch for changes
    This is useful if you want to run all your grunt stuff from
    one terminal
  */
  grunt.registerTask('default', ['build', 'concurrent:dev']);

  /*
    Same as above except server is started in debug
  */
  grunt.registerTask('debug', ['build', 'concurrent:debug']);

  /*
    Alternative to 'default' where you want to run your server
    and watch tasks/test in two different terminals
      grunt serve #terminal 1
      grunt dev   #terminal 2
  */
  grunt.registerTask('serve', ['nodemon:dev']);
  grunt.registerTask('serve-debug', ['concurrent:debug-only']);
  grunt.registerTask('dev', ['build', 'tests', 'watch']);
};

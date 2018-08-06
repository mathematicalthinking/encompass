/** # Grunt Configuration
 * @description We are using [Grunt](http://gruntjs.com/) the Javascript Task Runner
 *              for building and compiling the app. Below is the configuration.
 * @see [Grunt](http://gruntjs.com/)
 * @authors Philip Wisner, Dan Kelly & Dave Taylor
 * @since 2.0.0
 */

/*
 * MAIN GRUNT COMMANDS:
 * grunt - this builds the app and runs in 8080
 * grunt serve-test - this builds and runs the test server env in 8082
 * grunt tests - this runs all tests (run this in another tab after grunt serve-test)
 * grunt testEndToEnd - this runs the e2e (selenium) tests
 * grunt testApi - runs only the api (backend) tests
 */


/*jshint camelcase: false */
/*global module:false */
module.exports = function (grunt) {

  /*
   * All initial configurations for grunt tasks needs to be done inside grunt.initConfig()
   */
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
     * Set Node environment using grunt-env
     *  https://www.npmjs.com/package/grunt-env
     */
    env: {
      dev: {
        NODE_ENV: 'development'
      },
      test: {
        NODE_ENV: 'test'
      },
      seed: {
        NODE_ENV: 'seed'
      },
      prod: {
        NODE_ENV: 'production'
      }
    },
    /*
     * Set up the Mocha tests
     * It then runs the e2e (selenium tests) or the api (mocha/chai)
     * see: https://github.com/pghalliday/grunt-mocha-test
     */
    mochaTest: {
      e2e: {
        options: {
          reporter: 'spec',
          //captureFile: 'results.txt',
          quiet: false,
          clearRequireCache: false,
          clearCacheFilter: (key) => true,
          noFail: false
        },
        src: ['test/selenium/**/*.js']
      },
      api: {
        options: {
          reporter: 'spec',
          //captureFile: 'results.txt',
          quiet: false,
          clearRequireCache: false,
          clearCacheFilter: (key) => true,
          noFail: false
        },
        src: ['test/mocha/*.js']
      }
    },

    /*
     * Shell task to copy test database at beginning of system tests.
     */
    shell: {
      restoreTestDb: {
        command: 'mongorestore --drop --db=encompass_test ./test/data/encompass_test'
      },
      restoreSeedDb: {
        command: 'md-seed run --dropdb'
      },
      sleep3: {
        command: "echo 'sleep start';sleep 3;echo 'sleep done'"
      }
    },

    /*
     * Takes main.scss inside /scss files and converts it to main.css inside /build
     * You need to install ruby and `gem install sass` if you want to run grunt sass
     */
    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: 'scss',
          src: 'main.scss',
          dest: 'build',
          ext: '.css'
        }]
      }
    },

    /*
     * Runs babel to transpile ES6 code to ES5
     * It takes all .js files in app/ and places the transpiled code into babel/
     */
    babel: {
      options: {
        sourceMap: true,
        presets: ['env']
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'app',
          src: ['**/*.js'],
          dest: 'babel',
          ext: '.js'
        }]
      }
    },
    /*
      This reads the babel/app.js folder and builds all the
      required files into a single application.js file.

      Additionally it will wrap them in evals with @ sourceURL statements so errors,
      log statements and debugging will reference the source files by line number.

      You would set this option to false for production.
    */
    neuter: {
      dev: {
        options: {
          includeSourceURL: true
        },
        src: 'babel/app.js',
        dest: 'build/application.js'
      },
      prod: {
        src: 'babel/app.js',
        dest: 'build/application-prod.js'
      }
    },
    /*
      Browserify is just taking a single .js file
      and preparing it for the browser
    */
    browserify: {
      options: {
        browserifyOptions: {
          debug: true
        }
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
        tasks: ['browserify', 'MochaTests', 'jshint'], //common code is used on the front and backend
        options: {
          spawn: false
        }
      },
      common_files: {
        files: ['.jshintrc', 'Gruntfile.js'],
        tasks: ['jshint'], //anything could have changed in the Gruntfile
        options: {
          spawn: false
        }
      },
      ember_code: {
        files: ['app/**/*.js', 'dependencies/**/*.js', '!dependencies/compiled/templates.js', '!server/datasource/**', '!server/server.js', '!server/config.js'],
        tasks: ['neuter:dev', 'jshint'], //jqunit
        options: {
          spawn: false
        }
      },
      server_code: {
        files: ['server/server.js', 'server/fake_login.js', 'server/config.js', 'server/datasource/**/*.js'],
        tasks: ['jshint'], //nodemon monitors it's own files,
        options: {
          spawn: false
        }
      },
      handlebars_templates: {
        files: ['app/**/*.hbs'],
        tasks: ['emberTemplates', 'neuter:dev'], //jqunit
        options: {
          spawn: false
        }
      },
      common_tests: {
        files: ['test/jasmine/common/**'],
        tasks: ['jasmine:common', 'jshint'],
        options: {
          spawn: false
        }
      },
      ember_qunit: {
        files: ['test/qunit/**/*.*', 'test/data/fixtures.js'],
        tasks: ['jshint'], //jqunit
        options: {
          spawn: false
        }
      },
      sass_code: {
        files: ['scss/*.scss'],
        tasks: ['sass'],
        options: {
          spawn: false
        }
      }
    },

    /*
       These tests need to be rewritten, they are tests for the:
       properties_spec.js & workspace_spec.js
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
      Qunit tests are built into ember, they are currently out of date,
      Maybe only use for large components & pages
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
    /*
      Reads the projects .jshintrc file and applies coding
      standards. Doesn't lint the dependencies or test
      support files.
    */
    jshint: {
      all: ['Gruntfile.js', 'app/**/*.js', 'server/**/*.js', 'test/**/*.js', '!dependencies/*.*', '!test/qunit/support/*.*', '!test/selenium/*.js', '!test/data/*.js', '!server/db_migration/*.js', '!test/mocha/*.js'],
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
        templateName: function (sourceFile) {
          return sourceFile.replace(/app\/templates\//, '');
        },
        templateCompilerPath: 'dependencies/ember-template-compiler2_14_1.js'
      },
      'dependencies/compiled/templates.js': ["app/templates/**/*.hbs"]
    },

    nodemon: {
      dev: {
        script: 'server/server.js',
        options: {
          watch: ['server/server.js', 'config.json', 'server/config.js', 'server/datasource', 'build/common_bundle.js', 'Gruntfile.js']
        }
      },
      debug: {
        script: 'server/server.js',
        options: {
          nodeArgs: ['--debug'],
          watch: ['server/server.js', 'config.json', 'server/config.js', 'server/datasource', 'build/common_bundle.js', 'Gruntfile.js']
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
        tasks: ['nodemon:dev', 'jshint', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      },
      endToEndTasks: {
        tasks: ['nodemon:dev', 'endToEndTests']
      },
      apiTasks: {
        tasks: ['nodemon:dev', 'apiTests']
      },
      waitApiTasks: {
        tasks: ['nodemon:dev', 'waitApiTests']
      },
      test: {
        tasks: ['nodemon:dev', 'MochaTests', 'watch'],
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
        tasks: ['nodemon:debug', 'node-inspector', 'MochaTests', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      },
      systemTests: {
        tasks: ['nodemon:sysTest', 'mochaSelenium'],
        options: {
          logConcurrentOutput: true
        }
      }
    },
    // Would like to be able to put .env_* files in temp file in concat, and then output to .env filename in zip file.
    compress: {
      staging: {
        options: {
          archive: 'staging.zip'
        },
        files: [
          {src: [ 'build/**', 'common/**', 'dependencies/**', 'server/**', 'seeders/**', 'package.json', 'package-lock.json', '.env_staging', 'md-seed-config.js', 'md-seed-generator.json'], dest: './staging/', expand: true, cwd: '.'}
        ]
      },
      prod: {
        options: {
          archive: 'prod.zip'
        },
        files: [
          {src: [ 'build/**', 'common/**', 'dependencies/**', 'server/**', 'package.json', 'package-lock.json', '.env_prod'], dest: './prod/', expand: true, cwd: '.'}
        ]
      }
    },
    concat: {
      staging_env: {
        src: ['.env', 'staging_env'],
        dest: './.env_staging'
      },
      prod_env: {
        src: ['.env', 'prod_env'],
        dest: './.env_prod'
      }
    }
  });


  /*
  LOAD ALL GRUNT TASKS FROM NPM FILES
    This loads grunt: babel, browserify, uglify, jshint, jasmine,
    qunit, junit, neuter, contrib-watch, ember-templates, nodemon
    node-inspector, concurrent, jasmine-node, mocha-casperjs,
    mocha-test, casperjs, env, shell
 */
  require('load-grunt-tasks')(grunt);



  // ALL GRUNT TASKS & COMMANDS

  /*
    Build the application
      - convert all the handlebars templates into compile functions
      - convert all ES6 code in app to ES5
      - convert the common code into a single bundle
      - combine these files + application files in order
  */
  grunt.registerTask('build', ['emberTemplates', 'sass', 'babel', 'browserify', 'neuter']);

  grunt.registerTask('build-test', ['emberTemplates', 'babel', 'browserify', 'neuter']);

  /*
    Task for default `grunt` command
    This builds the app, runs the server and monitors for changes
  */
  grunt.registerTask('default', ['build', 'concurrent:dev']);

  // Same as above except server is started in debug
  grunt.registerTask('debug', ['build', 'concurrent:debug']);

  /*
  Tasks for running tests:
    - tests - runs all mochaTests - this should be changed to run all tests
    - jqunit - runs the qunit tests and the results output
    - endToEndTests - runs the e2e MochaTest (Selenium Tests)
    - apiTests - runs the api MochaTest (backend mocha/chai tets)
    - jasmineTests - NEED TO BE REPLACED
  */
  grunt.registerTask('MochaTests', ['endToEndTests', 'apiTests']);
  grunt.registerTask('jqunit', ['qunit_junit', 'qunit']);
  grunt.registerTask('endToEndTests', ['mochaTest:e2e']);
  grunt.registerTask('apiTests', ['mochaTest:api']);
  grunt.registerTask('jasmineTests', ['jasmine']);


  /*
    Alternative to 'default' where you want to run your server
    and watch tasks/test in two different terminals
      grunt serve #terminal 1
      grunt dev   #terminal 2
  */
  grunt.registerTask('serve', ['nodemon:dev']);
  grunt.registerTask('serve-debug', ['concurrent:debug-only']);
  grunt.registerTask('dev', ['env:dev', 'build', 'MochaTests', 'watch']);

  // Task for reseting the TestDB
  grunt.registerTask('resetTestDb', ['shell:restoreTestDb']);
  grunt.registerTask('resetSeedDb', ['shell:restoreSeedDb']);

  // Tasks for creating test server, running all tests, or running indiviudal tests
  grunt.registerTask('serve-test', ['env:test', 'resetTestDb', 'build-test', 'nodemon:dev']);
  grunt.registerTask('serve-seed', ['env:seed', 'resetSeedDb', 'build-test', 'nodemon:dev']);
  grunt.registerTask('tests', ['env:test', 'build-test', 'MochaTests']);
  grunt.registerTask('testEndToEnd', ['env:test', 'resetTestDb', 'concurrent:endToEndTasks']);
  grunt.registerTask('testApi', ['env:test', 'resetTestDb', 'concurrent:apiTasks']);
  grunt.registerTask('dist', ['concat', 'compress']);


  // CURRENTLY NOT USED TASKS
  // grunt.registerTask('sleep3', ['shell:sleep3']);
  // grunt.registerTask('testWaitApi', ['env:test', 'resetTestDb', 'concurrent:waitApiTasks']);
};
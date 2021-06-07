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
 * // deprecated grunt serve-test - this builds and runs the test server env in 8082
 * grunt serve-seed - this builds and runs the test server env in 8082
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
    pkg: grunt.file.readJSON("package.json"),
    //revision: process.env.SVN_REVISION || '??',
    //build: process.env.BUILD_NUMBER || '??',
    //
    // // Error: Unexpected token: operator (>).
    // // Line 265 in build/application-prod.js
    // // in _removeElsFromDom(els)
    // // at Line 265: els.forEach((el) => {
    // uglify: {
    //   application: {
    //     options: {
    //       banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
    //         '<%= grunt.template.today("yyyy-mm-dd") %>'
    //     },
    //     files: {
    //       // 'dist/application-<%= pkg.version %>-min.js': 'build/application-prod.js'
    //       'dist/application-min.js': 'build/application-prod.js'
    //     }
    //   }
    // },

    /*
     * Set Node environment using grunt-env
     *  https://www.npmjs.com/package/grunt-env
     */
    env: {
      dev: {
        NODE_ENV: "development",
      },
      test: {
        NODE_ENV: "test",
      },
      seed: {
        NODE_ENV: "seed",
      },
      prod: {
        NODE_ENV: "production",
      },
    },
    /*
     * Set up the Mocha tests
     * It then runs the e2e (selenium tests) or the api (mocha/chai)
     * see: https://github.com/pghalliday/grunt-mocha-test
     */
    mochaTest: {
      e2e: {
        options: {
          reporter: "spec",
          //captureFile: 'results.txt',
          quiet: false,
          clearRequireCache: false,
          clearCacheFilter: (key) => true,
          noFail: false,
        },
        src: ["test/selenium/assignments_student.js"],
      },
      travis: {
        options: {
          reporter: "spec",
          //captureFile: 'results.txt',
          quiet: false,
          clearRequireCache: false,
          clearCacheFilter: (key) => true,
          noFail: false,
        },
        src: [
          "test/selenium/base.js",
          "test/selenium/comments.js",
          "test/selenium/folders.js",
          "test/selenium/helpers.js",
          "test/selenium/problems.js",
          "test/selenium/responses.js",
          "test/selenium/sections.js",
          "test/selenium/selectors.js",
          "test/selenium/workspaces_new.js",
          "test/selenium/workspaces.js",
        ],
      },
      api: {
        options: {
          reporter: "spec",
          //captureFile: 'results.txt',
          quiet: false,
          clearRequireCache: false,
          clearCacheFilter: (key) => true,
          noFail: false,
        },
        src: ["test/mocha/*.js", "test/mocha/unit-tests/*.js"],
      },
      e2e_xProb: {
        // does not run problems and users tests
        options: {
          reporter: "spec",
          //captureFile: 'results.txt',
          quiet: false,
          clearRequireCache: false,
          clearCacheFilter: (key) => true,
          noFail: false,
        },
        src: [
          "test/selenium/assignments_teacher.js",
          "test/selenium/assignments_students.js",
          "test/selenium/base.js",
          "test/selenium/comments.js",
          "test/selenium/confirm_email.js",
          "test/selenium/forgot_password",
          "test/selenium/folders.js",
          "test/selenium/linked_workspaces.js",
          "test/selenium/mentoring_approving",
          "test/selenium/mentoring",
          "test/selenium/parent_workspace",
          "test/selenium/responses.js",
          "test/selenium/sections.js",
          "test/selenium/users.js",
          "test/selenium/vmt_import.js",
          "test/selenium/workspaces_new.js",
          "test/selenium/workspaces.js",
          "test/selenium/workspaces_settings",
        ],
      },
      e2eProblems: {
        options: {
          reporter: "spec",
          //captureFile: 'results.txt',
          quiet: false,
          clearRequireCache: false,
          clearCacheFilter: (key) => true,
          noFail: false,
        },
        src: [
          "test/selenium/problems.js",
          "test/selenium/problems_info.js",
          "test/selenium/problems_new",
        ],
      },
      e2eAuth: {
        options: {
          reporter: "spec",
          //captureFile: 'results.txt',
          quiet: false,
          clearRequireCache: false,
          clearCacheFilter: (key) => true,
          noFail: false,
        },
        src: [
          "test/selenium/confirm_email.js",
          "test/selenium/forgot_password.js",
          "test/selenium/reset_password.js",
          "test/selenium/signup.js",
          "test/selenium/users.js",
        ],
      },
      e2eWorkspaces: {
        options: {
          reporter: "spec",
          //captureFile: 'results.txt',
          quiet: false,
          clearRequireCache: false,
          clearCacheFilter: (key) => true,
          noFail: false,
        },
        src: [
          "test/selenium/comments.js",
          "test/selenium/folders.js",
          "test/selenium/workspace_settings.js",
          "test/selenium/workspaces.js",
          "test/selenium/workspaces_new.js",
        ],
      },
      e2eMentoring: {
        options: {
          reporter: "spec",
          //captureFile: 'results.txt',
          quiet: false,
          clearRequireCache: false,
          clearCacheFilter: (key) => true,
          noFail: false,
        },
        src: [
          "test/selenium/mentoring_approving.js",
          "test/selenium/responses.js",
        ], // fix and add back in: 'test/selenium/mentoring.js'
      },
      e2eVmt: {
        options: {
          reporter: "spec",
          //captureFile: 'results.txt',
          quiet: false,
          clearRequireCache: false,
          clearCacheFilter: (key) => true,
          noFail: false,
        },
        src: ["test/selenium/vmt_import.js"],
      },
      e2eGeneral: {
        options: {
          reporter: "spec",
          //captureFile: 'results.txt',
          quiet: false,
          clearRequireCache: false,
          clearCacheFilter: (key) => true,
          noFail: false,
        },
        src: [
          "test/selenium/base.js",
          "test/selenium/assignments_student.js",
          "test/selenium/assignments_teacher.js",
          "test/selenium/sections.js",
          "test/selenium/linked_workspaces.js",
          "test/selenium/parent_workspaces.js",
        ],
      },
    },

    /*
     * Shell task to copy test database at beginning of system tests.
     */
    shell: {
      restoreTestDb: {
        command:
          "mongorestore --drop --db=encompass_test ./test/data/encompass_test",
      },
      restoreSeedDb: {
        command: "npm run seed",
      },
      sleep3: {
        command: "echo 'sleep start';sleep 3;echo 'sleep done'",
      },
    },

    /*
     * Takes main.scss inside /scss files and converts it to main.css inside /build
     * You need to install ruby and `gem install sass` if you want to run grunt sass
     */
    sass: {
      dist: {
        files: [
          {
            expand: true,
            cwd: "scss",
            src: "main.scss",
            dest: "build",
            ext: ".css",
          },
        ],
      },
    },

    /*
     * Runs babel to transpile ES6 code to ES5
     * It takes all .js files in app/ and places the transpiled code into babel/
     */
    babel: {
      options: {
        sourceMap: true,
        presets: ["@babel/preset-env"],
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: "app",
            src: ["**/*.js"],
            dest: "babel",
            ext: ".js",
          },
        ],
      },
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
          includeSourceURL: true,
        },
        src: "babel/app.js",
        dest: "build/application.js",
      },
      prod: {
        src: "babel/app.js",
        dest: "build/application-prod.js",
      },
    },
    /*
      Browserify is just taking a single .js file
      and preparing it for the browser
    */
    browserify: {
      options: {
        browserifyOptions: {
          debug: true,
        },
      },
      main: {
        src: "common/browser.js",
        dest: "build/common_bundle.js",
      },
    },

    /*
      Watch files for changes.
      Not spawning a new grunt task speeds this up quite a bit
    */
    watch: {
      common_code: {
        files: ["common/**/*.js"],
        tasks: ["browserify", "MochaTests", "eslint"], //common code is used on the front and backend
        options: {
          spawn: false,
        },
      },
      common_files: {
        files: ["Gruntfile.js", ".eslintrc.js"],
        tasks: ["eslint"], //anything could have changed in the Gruntfile
        options: {
          spawn: false,
        },
      },
      ember_code: {
        files: [
          "app/**/*.js",
          "dependencies/**/*.js",
          "!dependencies/compiled/templates.js",
          "!server/datasource/**",
          "!server/server.js",
          "!server/config.js",
        ],
        tasks: ["neuter:dev", "eslint"], //jqunit
        options: {
          spawn: false,
        },
      },
      server_code: {
        files: [
          "server/server.js",
          "server/fake_login.js",
          "server/config.js",
          "server/datasource/**/*.js",
        ],
        tasks: ["eslint"], //nodemon monitors it's own files,
        options: {
          spawn: false,
        },
      },
      handlebars_templates: {
        files: ["app/**/*.hbs"],
        tasks: ["emberTemplates", "neuter:dev"], //jqunit
        options: {
          spawn: false,
        },
      },
      common_tests: {
        files: ["test/jasmine/common/**"],
        tasks: ["jasmine:common", "eslint"],
        options: {
          spawn: false,
        },
      },
      ember_qunit: {
        files: ["test/qunit/**/*.*", "test/data/fixtures.js"],
        tasks: ["eslint"], //jqunit
        options: {
          spawn: false,
        },
      },
      sass_code: {
        files: ["scss/*.scss"],
        tasks: ["sass"],
        options: {
          spawn: false,
        },
      },
    },

    /*
       These tests need to be rewritten, they are tests for the:
       properties_spec.js & workspace_spec.js
    */
    jasmine: {
      common: {
        src: "build/common_bundle.js",
        options: {
          specs: ["test/jasmine/common/**/*_spec.js"],
          junit: {
            path: "build/.test",
          },
          //display: 'short',
          summary: false, //https://github.com/gruntjs/grunt-contrib-jasmine/issues/145
          keepRunner: true,
        },
      },
    },
    /*
      Qunit tests are built into ember, they are currently out of date,
      Maybe only use for large components & pages
    */
    qunit: {
      all: ["test/qunit/q*html"],
      options: {
        console: false, //like to use 0.5.0 https://github.com/gruntjs/grunt-contrib-qunit/issues/68
      },
    },

    /*
      Generate junit reports from qunit runs
    */
    qunit_junit: {
      options: {
        dest: "build/.test",
      },
    },
    /*
      Reads the projects .jshintrc file and applies coding
      standards. Doesn't lint the dependencies or test
      support files.
    */
    jshint: {
      all: [
        "Gruntfile.js",
        "app/**/*.js",
        "server/**/*.js",
        "test/**/*.js",
        "!dependencies/*.*",
        "!test/qunit/support/*.*",
        "!test/selenium/*.js",
        "!test/data/*.js",
        "!server/db_migration/*.js",
        "!test/mocha/*.js",
        "!server/middleware/access/*.js",
      ],
      options: {
        jshintrc: ".jshintrc",
      },
    },
    eslint: {
      target: [
        "Gruntfile.js",
        "app/**/*.js",
        "server/**/*.js",
        "common/*.js",
        "!dependencies/*.*",
        "!test/qunit/support/*.*",
        "test/selenium/*.js",
        "test/data/*.js",
        "!server/db_migration/*.js",
        "test/mocha/*.js",
        "server/middleware/access/*.js",
        "!server/fake_login.js",
      ],
      options: {
        configFile: ".eslintrc.js",
      },
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
          return sourceFile.replace(/app\/templates\//, "");
        },
        templateCompilerPath: "dependencies/ember-template-compiler2_14_1.js",
      },
      "dependencies/compiled/templates.js": ["app/templates/**/*.hbs"],
    },

    nodemon: {
      dev: {
        script: "server/server.js",
        options: {
          watch: [
            "server/server.js",
            "config.json",
            "server/config.js",
            "server/datasource",
            "Gruntfile.js",
          ],
        },
      },
      debug: {
        script: "server/server.js",
        options: {
          nodeArgs: ["--debug"],
          watch: [
            "server/server.js",
            "config.json",
            "server/config.js",
            "server/datasource",
            "Gruntfile.js",
          ],
        },
      },
    },

    "node-inspector": {
      custom: {
        options: {
          "web-port": 8081,
        },
      },
    },

    /**
     * Run nodemon and watch concurrently (in one tab)
     */
    concurrent: {
      dev: {
        tasks: ["nodemon:dev", "eslint", "watch"],
        options: {
          logConcurrentOutput: true,
        },
      },
      endToEndTasks: {
        tasks: ["nodemon:dev", "endToEndTests"],
      },
      apiTasks: {
        tasks: ["nodemon:dev", "apiTests"],
      },
      waitApiTasks: {
        tasks: ["nodemon:dev", "waitApiTests"],
      },
      test: {
        tasks: ["nodemon:dev", "MochaTests", "watch"],
        options: {
          logConcurrentOutput: true,
        },
      },
      "debug-only": {
        tasks: ["nodemon:debug", "node-inspector"],
        options: {
          logConcurrentOutput: true,
        },
      },
      debug: {
        tasks: ["nodemon:debug", "node-inspector", "MochaTests", "watch"],
        options: {
          logConcurrentOutput: true,
        },
      },
      systemTests: {
        tasks: ["nodemon:sysTest", "mochaSelenium"],
        options: {
          logConcurrentOutput: true,
        },
      },
    },
    // Would like to be able to put .env_* files in temp file in concat, and then output to .env filename in zip file.
    compress: {
      staging: {
        options: {
          archive: "staging.zip",
        },
        files: [
          {
            src: [
              "dist/**",
              "common/**",
              "dependencies/**",
              "server/**",
              "seeders/**",
              "package.json",
              "package-lock.json",
              ".env_staging",
              "md-seed-config.js",
              "md-seed-generator.json",
            ],
            dest: "./staging/",
            expand: true,
            cwd: ".",
          },
        ],
      },
      prod: {
        options: {
          archive: "prod.zip",
        },
        files: [
          {
            src: [
              "dist/**",
              "common/**",
              "dependencies/**",
              "server/**",
              "package.json",
              "package-lock.json",
              ".env_prod",
            ],
            dest: "./prod/",
            expand: true,
            cwd: ".",
          },
        ],
      },
    },
    concat: {
      staging_env: {
        src: [".env", "staging_env"],
        dest: "./.env_staging",
      },
      prod_env: {
        src: [".env", "prod_env"],
        dest: "./.env_prod",
      },
    },
    // // bump up version number (package and git) - not working
    // bump: {
    //   options: {
    //     files: ['package.json'],
    //     updateConfigs: [],
    //     commit: false,
    //     commitMessage: 'Release v%VERSION%',
    //     commitFiles: ['package.json'],
    //     createTag: false,
    //     tagName: 'v%VERSION%',
    //     tagMessage: 'Version %VERSION%',
    //     push: false,
    //     pushTo: 'upstream',
    //     gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
    //     globalReplace: false,
    //     prereleaseName: false,
    //     metadata: '',
    //     regExp: false
    //   }
    // },
    clean: {
      dist: {
        src: ["dist/", "build/assets.json"],
      },
    },
    // create versioned files in dist directory (from build directory)
    assets_versioning: {
      dist: {
        options: {
          versionsMapTrimPath: "dist/",
          versionsMapFile: "assets.json",
          tag: "date",
        },
        files: {
          "dist/base.css": ["build/base.css"],
          "dist/guiders.css": ["build/guiders.css"],
          "dist/main.css": ["build/main.css"],
          "dist/application.js": ["build/application.js"],
          "dist/common_bundle.js": ["build/common_bundle.js"],
          "dist/guiders.js": ["build/guiders.js"],
          "dist/jquery.sticky.js": ["build/jquery.sticky.js"],
        },
      },
    },
    // copy unversioned files to dist directory (from build directory)
    copy: {
      dist: {
        files: [
          // copy images folder in build to dist
          {
            cwd: "build/images",
            expand: true,
            src: ["**"],
            dest: "dist/images",
            flatten: true,
          },
          // copy all html files in build root to dist
          { cwd: "build", expand: true, src: ["license.html"], dest: "dist" },
          // copy all png files in build root (bg.png). is this needed ???
          { cwd: "build", expand: true, src: ["*.png", "*.svg"], dest: "dist" },
          {
            cwd: "build/image_uploads",
            expand: true,
            src: ["**"],
            dest: "dist/image_uploads",
            flatten: true,
          },
        ],
      },
    },
    // replace asset filenames in index.html using mapping
    "string-replace": {
      dist: {
        files: [
          {
            expand: true,
            cwd: "build/",
            src: "index.html",
            dest: "dist/",
          },
        ],
        options: {
          // replacements: [{
          //   pattern: '<%= mapping.originalPath.var1 %>',
          //   replacement: '<%= mapping.versionedPath.var2 %>'
          // }]
          replacements: [], // <-- Intentionally empty and will be dynamically configured via `configAndRunStringReplace`.
        },
      },
    },
  });

  /*
  LOAD ALL GRUNT TASKS FROM NPM FILES
    This loads grunt: babel, browserify, uglify, jshint, jasmine,
    qunit, junit, neuter, contrib-watch, ember-templates, nodemon
    node-inspector, concurrent, jasmine-node, mocha-casperjs,
    mocha-test, casperjs, env, shell
 */
  require("load-grunt-tasks")(grunt);

  // ALL GRUNT TASKS & COMMANDS

  /*
    Build the application
      - convert all the handlebars templates into compile functions
      - convert all ES6 code in app to ES5
      - convert the common code into a single bundle
      - combine these files + application files in order
  */
  grunt.registerTask("build", [
    "emberTemplates",
    "sass",
    "babel",
    "browserify",
    "neuter",
  ]);

  grunt.registerTask("build-test", [
    "emberTemplates",
    "babel",
    "browserify",
    "neuter",
  ]);

  /*
    Task for default `grunt` command
    This builds the app, runs the server and monitors for changes
  */
  grunt.registerTask("default", ["build", "concurrent:dev"]);

  // Same as above except server is started in debug
  grunt.registerTask("debug", ["build", "concurrent:debug"]);

  /*
  Tasks for running tests:
    - tests - runs all mochaTests - this should be changed to run all tests
    - jqunit - runs the qunit tests and the results output
    - endToEndTests - runs the e2e MochaTest (Selenium Tests)
    - apiTests - runs the api MochaTest (backend mocha/chai tets)
    - jasmineTests - NEED TO BE REPLACED
  */
  grunt.registerTask("MochaTests", ["endToEndTests", "apiTests"]);
  grunt.registerTask("jqunit", ["qunit_junit", "qunit"]);
  grunt.registerTask("endToEndTests", ["mochaTest:e2e"]);
  grunt.registerTask("travis", ["mochaTest:travis", "apiTests"]);
  grunt.registerTask("apiTests", ["mochaTest:api"]);
  grunt.registerTask("jasmineTests", ["jasmine"]);

  /*
    Alternative to 'default' where you want to run your server
    and watch tasks/test in two different terminals
      grunt serve #terminal 1
      grunt dev   #terminal 2
  */
  grunt.registerTask("serve", ["nodemon:dev"]);
  grunt.registerTask("serve-debug", ["concurrent:debug-only"]);
  grunt.registerTask("dev", ["env:dev", "build", "MochaTests", "watch"]);

  // Task for reseting the TestDB
  grunt.registerTask("resetTestDb", ["shell:restoreTestDb"]);
  grunt.registerTask("resetSeedDb", ["shell:restoreSeedDb"]);

  // Tasks for creating test server, running all tests, or running indiviudal tests
  grunt.registerTask("serve-test", [
    "env:test",
    "resetTestDb",
    "build-test",
    "nodemon:dev",
  ]);
  grunt.registerTask("serve-seed", [
    "env:seed",
    "resetSeedDb",
    "build-test",
    "nodemon:dev",
  ]);
  grunt.registerTask("tests", ["env:test", "build-test", "MochaTests"]);
  grunt.registerTask("travisTests", ["env:test", "build-test", "travis"]);
  grunt.registerTask("testEndToEnd", [
    "env:test",
    "resetTestDb",
    "concurrent:endToEndTasks",
  ]);
  grunt.registerTask("testApi", [
    "env:test",
    "resetTestDb",
    "concurrent:apiTasks",
  ]);
  // grunt.registerTask('bump', ['bump']);
  grunt.registerTask("dist", [
    "build",
    "concat",
    "clean",
    "assets_versioning:dist",
    "configAndRunStringReplace",
    "copy:dist",
    "compress",
  ]);
  // grunt.registerTask('map', ['clean:dist', 'assets_versioning:dist', 'configAndRunStringReplace']);

  /**
   *  Helper task to dynamically configure the Array of Objects for the
   * `options.replacements` property in the `dist` target of the `string-replace`
   *  task. Each property name of the `variableToReplace` Object (found in
   * `package.json`) is set as the search string, and it's respective value
   *  is set as the replacement value.
   */
  grunt.registerTask("configAndRunStringReplace", function () {
    // 1. Read the `originalPath` mapping object from `assets.json` (Created by assets-versioning versionsMapFile option.
    var replacements = grunt.file.readJSON("assets.json"),
      config = [];

    // 2. Dynamically build the `options.replacements` array.
    for (var key in replacements) {
      if (replacements[key] && replacements[key].originalPath) {
        console.log(
          `replacement pair= ${key}: ${replacements[key].versionedPath}`
        );
        // console.log(`pattern: ${new RegExp(key, 'g')}`)
        console.log(`pattern: ${replacements[key].originalPath}`);
        config.push({
          // pattern: new RegExp(key, 'g'),
          pattern: replacements[key].originalPath,
          // replacement: replacements[key]
          replacement: replacements[key].versionedPath,
        });
      }
    }

    // 3. Configure the option.replacements values.
    grunt.config.set("string-replace.dist.options.replacements", config);

    // 4. Run the task.
    grunt.task.run("string-replace:dist");
  });

  // Note: In the `default` Task we add the `configAndRunStringReplace`
  // task to the taskList array instead of `string-replace`.
  // grunt.registerTask('map2', ['configAndRunStringReplace']);
};

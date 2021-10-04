'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    sassOptions: {
      extension: 'scss',
    },
  });
  app.import('vendor/jquery.cookie.js');
  app.import('vendor/tree.jquery.js');

  // app.import('vendor/underscore-min.js');
  app.import('vendor/ie_hacks.js');
  app.import('vendor/image-tagging.js');
  app.import('vendor/selection-highlighting.js');
  app.import('vendor/bind.polyfill.js');
  app.import('vendor/randomcolor.js');
  /*
   * These are the dependencies for an Ember application
   * and they have to be loaded before any application code.
   */
  app.import('vendor/jquery-3.2.1.min.js');
  app.import('vendor/jquery.cookie.js');
  app.import('vendor/underscore-min.js');

  app.import('vendor/guiders.js');
  app.import('vendor/jq.keys.js');
  app.import('vendor/typeahead.bundle.js');
  app.import('vendor/validate.min.js');
  app.import('vendor/selectize.js');
  app.import('vendor/dropzone.js');
  app.import('vendor/socket.io.js');

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree();
};

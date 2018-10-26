/*
 * Hey! This is an Ember application. It's built using a
 * neuter task (see this project's Gruntfile for what that means).
 *
 * `require`s in this file will be stripped and replaced with
 * the string contents of the file they refer to wrapped in
 * a closure.
 *
 * Each file contains its own commenting, so feel free to crack
 * them open if you want more information about what is going on.
*/

require('dependencies/underscore-min');
require('dependencies/ie_hacks.js');
require('dependencies/image-tagging');
require('dependencies/selection-highlighting');
require('dependencies/bind.polyfill');
/*
 * These are the dependencies for an Ember application
 * and they have to be loaded before any application code.
*/
require('dependencies/jquery-3.2.1.min');
require('dependencies/jquery.cookie');

require('dependencies/guiders');
require('dependencies/jq.keys');
require('dependencies/typeahead.bundle');
require('dependencies/validate.min.js');
require('dependencies/selectize.js');

/*
 * Since we're precompiling our templates, we only need the
 * handlebars-runtime microlib instead of the
 * entire handlebars library and its string parsing functions.
*/
require('dependencies/handlebars-runtime');

/** This is Ember. I think you'll like it
 * The window.ENV setting enables the {{control}} helper in Ember templates
 * Must be set before ember is required
 */
window.ENV = window.ENV || {}; // Enable {{control}} helper in Ember templates
window.ENV.EXPERIMENTAL_CONTROL_HELPER = true;
//require('dependencies/ember-template-compiler2_0_3');
require('dependencies/ember-template-compiler2_14_1');

//require('dependencies/ember2_0_3');
require('dependencies/ember2_14_1');

//require('dependencies/ember-data2_0_1');
//require('dependencies/ember-data2_2_1');
require('dependencies/ember-data2_12_2');

require('dependencies/moment-with-locales.min');
require('dependencies/daterangepicker');

require('dependencies/error');
require('dependencies/ajax');


/*
  this file is generated as part of the build process.
  If you haven't run that yet, you won't see it.

  It is excluded from git commits since it's a
  generated file.
*/
require('dependencies/compiled/templates');

var QUNIT   = window.TESTING;
var TEST_MODE = (QUNIT);
var rootElement = '#encompass';
var PRINT_DEBUG_TO_CONSOLE = true;

if (TEST_MODE) {
  PRINT_DEBUG_TO_CONSOLE = false;
  rootElement = '#testing-location';
}

/*
  Creates a new instance of an Ember application and
  specifies what HTML element inside index.html Ember
  should manage for you.
*/
window.Encompass = Ember.Application.create({
  rootElement:                rootElement,
  LOG_TRANSITIONS:            PRINT_DEBUG_TO_CONSOLE,
  LOG_TRANSITIONS_INTERNAL:   PRINT_DEBUG_TO_CONSOLE,
  LOG_VIEW_LOOKUPS:           PRINT_DEBUG_TO_CONSOLE,
  LOG_ACTIVE_GENERATION:      PRINT_DEBUG_TO_CONSOLE,
  LOG_BINDINGS:               PRINT_DEBUG_TO_CONSOLE
});

if (QUNIT) {
  Encompass.setupForTesting();
  Encompass.injectTestHelpers();
}

Ember.run.backburner.DEBUG = true;

Encompass.ApplicationAdapter = DS.RESTAdapter.extend({
  namespace: 'api',
  //fetchBatchSize: 100, thought this would work for beta.9 but no
  coalesceFindRequests: true,
  headers: {
    'Accept-Version': '*'
  }
});

Encompass.ApplicationSerializer = DS.RESTSerializer.extend({
  primaryKey: "_id", // Fix for Ember to recognise Mongoose object ids
  isNewSerializerAPI: true
});

require('./mixins/*');

Encompass.StoreService = DS.Store.extend(Encompass.CacheableModels, {
  adapter: Encompass.ApplicationAdapter
});

/* Raw transformation type for sending data over without serialization
   -- We probably want to move this into a transformations folder
      if we end up needing others
*/
Encompass.RawTransform = DS.Transform.extend({

  deserialize: function(serialized) {
    return serialized;
  },

  serialize: function(deserialized) {
    return deserialized;
  }
});


/*
 * Model layer.
 * Ember.Object itself provides most of what
 * model layers elsewhere provide. Since TodoMVC
 * doesn't communicate with a server, plain
 * Ember.Objects will do.
*/
require('./models/*');

/*
 * Controller layer.
 * Controllers wrap objects and provide a place
 * to implement properties for display
 * whose value is computed from the content of the
 * controllers wrapped objects.
*/
require('./controllers/*');
require('./services/*');


/*
 * States (i.e. Routes)
 * Handles serialization of the application's current state
 * which results in view hierarchy updates. Responds to
 * actions.
*/
require('./router.js');
require('./routes/*');

require('./components/*');

require('./helpers/*');


// import Resolver from './resolver';
import Application from '@ember/application';
import loadInitializers from 'ember-load-initializers';
import Resolver from 'ember-resolver';
import $ from 'jquery';
import _ from 'lodash';
import config from './config/environment';

// export for others scripts to use
window.$ = $;
window._ = _;

$.ajaxSetup({
  xhrFields: {
    withCredentials: false,
  },
  crossDomain: true,
});

window.ENV = window.ENV || {}; // Enable {{control}} helper in Ember templates
window.ENV.EXPERIMENTAL_CONTROL_HELPER = true;
var QUNIT = window.TESTING;
var TEST_MODE = QUNIT;
var rootElement = '#encompass';
var PRINT_DEBUG_TO_CONSOLE = true;

if (TEST_MODE) {
  PRINT_DEBUG_TO_CONSOLE = false;
  rootElement = '#testing-location';
}
// Ember.run.backburner.DEBUG = true;

// const App = Ember.Application.extend({
//   modulePrefix: config.modulePrefix,
//   podModulePrefix: config.podModulePrefix,
//   Resolver,
//   LOG_TRANSITIONS: PRINT_DEBUG_TO_CONSOLE,
//   LOG_TRANSITIONS_INTERNAL: PRINT_DEBUG_TO_CONSOLE,
//   LOG_VIEW_LOOKUPS: PRINT_DEBUG_TO_CONSOLE,
//   LOG_ACTIVE_GENERATION: PRINT_DEBUG_TO_CONSOLE,
//   LOG_BINDINGS: PRINT_DEBUG_TO_CONSOLE
// });

// if (QUNIT) {
//   Encompass.setupForTesting();
//   Encompass.injectTestHelpers();
// }

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

loadInitializers(App, config.modulePrefix);
window.Encompass = App;

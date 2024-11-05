// app/initializers/deprecation-handler.js
import { registerDeprecationHandler } from '@ember/debug';

export function initialize() {
  registerDeprecationHandler((message, options, next) => {
    // Example: Skip deprecations that aren't until version 4.0.0
    if (options && options.until && options.until !== '4.0.0') {
      return;
    }
    // Call the next handler if you want to log the deprecation
    next(message, options);
  });
}

export default {
  initialize,
};

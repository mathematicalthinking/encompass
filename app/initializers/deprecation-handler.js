// Note that this initializer should be deleted before the app is deployed to production.

import { registerDeprecationHandler } from '@ember/debug';

export function initialize() {
  registerDeprecationHandler((message, options, next) => {
    // Skip deprecations targeted for future versions
    if (options?.until && options.until > '4.5.0') {
      return;
    }

    // Log deprecations for monitoring (optional)
    console.warn(`Deprecation: ${message}`, options);

    // Pass to the next handler
    next(message, options);
  });
}

export default {
  initialize,
};

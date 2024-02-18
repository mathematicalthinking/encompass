import { later } from '@ember/runloop';
import Service from '@ember/service';

export default Service.extend({
  handleLoadingMessage(
    context,
    eventType,
    triggerProperty,
    propToSet,
    timeout = 500
  ) {
    // Helper function to abstract get operation so context can be classic or Glimmer component
    function getContextProperty(context, propName) {
      if (typeof context.get === 'function') {
        return context.get(propName);
      } else {
        return context[propName];
      }
    }

    // Helper function to abstract set operation
    function setContextProperty(context, propName, value) {
      if (typeof context.set === 'function') {
        context.set(propName, value);
      } else {
        context[propName] = value;
      }
    }

    if (
      getContextProperty(context, 'isDestroyed') ||
      getContextProperty(context, 'isDestroying')
    ) {
      return;
    }

    let isDisplayingLoadingMessage = getContextProperty(context, propToSet);

    if (eventType === 'start') {
      setContextProperty(context, triggerProperty, true);
    } else if (eventType === 'end') {
      setContextProperty(context, triggerProperty, false);
      if (isDisplayingLoadingMessage) {
        setContextProperty(context, propToSet, false);
      }
      return;
    }

    later(function () {
      if (
        getContextProperty(context, 'isDestroyed') ||
        getContextProperty(context, 'isDestroying')
      ) {
        return;
      }
      let isInProgress = getContextProperty(context, triggerProperty);
      let isDisplayingLoadingMessage = getContextProperty(context, propToSet);

      if (isInProgress) {
        if (!isDisplayingLoadingMessage) {
          setContextProperty(context, propToSet, true);
        }
      } else {
        if (isDisplayingLoadingMessage) {
          setContextProperty(context, propToSet, false);
        }
      }
    }, timeout);
  },
});

import { later } from '@ember/runloop';
import Service from '@ember/service';






export default Service.extend({

  handleLoadingMessage(context, eventType, triggerProperty, propToSet, timeout = 500) {
    if (context.get('isDestroyed') || context.get('isDestroying')) {
      return;
    }

    let isDisplayingLoadingMessage = context.get(propToSet);

    if (eventType === 'start') {
      context.set(triggerProperty, true);
    } else if (eventType === 'end') {
      context.set(triggerProperty, false);
      if (isDisplayingLoadingMessage) {
        context.set(propToSet, false);
      }
      return;
    } else {
      // invalid eventType
      return;
    }

    later(function () {
      if (context.isDestroyed || context.isDestroying) {
        return;
      }
      let isInProgress = context.get(triggerProperty);
      let isDisplayingLoadingMessage = context.get(propToSet);

      if (isInProgress) {
        if (!isDisplayingLoadingMessage) {
          context.set(propToSet, true);
          return;
        }
      } else {
        if (isDisplayingLoadingMessage) {
          context.set(propToSet, false);
        }
      }
    }, timeout);
  }
});
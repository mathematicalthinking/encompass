import Service from '@ember/service';

export default class LoadingMessageService extends Service {
  handleLoadingMessage(
    context,
    eventType,
    triggerProperty,
    propToSet,
    timeout = 500
  ) {
    if (context.isDestroyed || context.isDestroying) return;

    let isDisplayingLoadingMessage = context[propToSet];

    if (eventType === 'start') {
      context[triggerProperty] = true;
    } else if (eventType === 'end') {
      context[triggerProperty] = false;
      if (isDisplayingLoadingMessage) {
        context[propToSet] = false;
      }
      return;
    } else {
      return; // invalid eventType
    }

    setTimeout(() => {
      if (context.isDestroyed || context.isDestroying) return;

      let isInProgress = context[triggerProperty];
      let isStillDisplaying = context[propToSet];

      if (isInProgress) {
        if (!isStillDisplaying) {
          context[propToSet] = true;
        }
      } else {
        if (isStillDisplaying) {
          context[propToSet] = false;
        }
      }
    }, timeout);
  }
}

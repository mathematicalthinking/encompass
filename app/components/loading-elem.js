import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: 'loading-elem',

  defaultMessage: 'Request in progress. Thank you for your patience!',

  loadingText: computed('loadingMessage', 'defaultMessage', function () {
    return this.loadingMessage || this.defaultMessage;
  }),
});

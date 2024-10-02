import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: 'loading-elem',

  defaultMessage: 'Request in progress. Thank you for your patience!',

  loadingText: computed.or('loadingMessage', 'defaultMessage'),
});

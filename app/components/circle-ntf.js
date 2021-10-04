import Component from '@ember/component';
import { computed } from '@ember/object';
import { equal } from '@ember/object/computed';

export default Component.extend({
  classNames: ['circle-ntf'],

  count: computed('displayCount', function () {
    let count = this.displayCount;

    if (typeof count !== 'number') {
      return 0;
    }
    if (count > 99) {
      return '99+';
    }
    return count;
  }),

  areNoNtfs: equal('count', 0),
});

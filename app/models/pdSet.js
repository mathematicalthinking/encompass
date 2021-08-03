import Model, { attr } from '@ember-data/model';
import { computed } from '@ember/object';

export default Model.extend({
  count: attr('number'),
  label: computed('count', function () {
    return this.id + ' (' + this.count + ' submissions)';
  }),
});

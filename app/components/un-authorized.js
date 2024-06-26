import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
export default Component.extend({
  elementId: 'un-authorized',
  mtAuth: service(),
  contactEmail: computed(function () {
    return this.mtAuth.getContactEmail();
  }),
});

import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
export default Component.extend({
  content: null,
  mtAuth: service(),
  googleUrl: computed(function () {
    return this.mtAuth.getSsoGoogleUrl();
  }),

  actions: {},
});

import Component from '@ember/component';
import { computed } from '@ember/object';
import MtAuthMixin from '../mixins/mt_auth_mixin';

export default Component.extend(MtAuthMixin, {
  elementId: 'un-authorized',

  contactEmail: computed(function () {
    return this.getContactEmail();
  }),
});

import Component from '@ember/component';
import { computed } from '@ember/object';
import CurrentUserMixin from '../mixins/current_user_mixin';
import MtAuthMixin from '../mixins/mt_auth_mixin';

export default Component.extend(CurrentUserMixin, MtAuthMixin, {
  elementId: 'un-authorized',

  contactEmail: computed(function () {
    return this.getContactEmail();
  }),
});

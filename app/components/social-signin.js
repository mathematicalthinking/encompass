import Component from '@ember/component';
import { computed } from '@ember/object';
import MtAuthMixin from '../mixins/mt_auth_mixin';

export default Component.extend(MtAuthMixin, {
  content: null,

  googleUrl: computed(function () {
    return this.getSsoGoogleUrl();
  }),

  actions: {},
});

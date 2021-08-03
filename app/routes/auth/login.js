import MtAuthMixin from '../../mixins/mt_auth_mixin';
import LoggedOutRoute from './_logged_out_route';

export default LoggedOutRoute.extend(MtAuthMixin, {
  // queryParams: 'oauthError',
  // beforeModel(transition) {
  //   this._super(...arguments);
  //   this.set('oauthError', oauthError);
  // },

  model: function (params) {
    return {
      oauthError: this.oauthError,
    };
  },

  actions: {
    toHome: function () {
      window.location.href = '/';
    },
  },
});

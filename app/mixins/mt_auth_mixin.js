Encompass.MtAuthMixin = Ember.Mixin.create({
getRedirectUrl() {
  return window.location.origin;
},

getMtSsoUrl() {
  let hostname = window.location.hostname;

  if (hostname === 'encompass.mathematicalthinking.org') {
    return `https://sso.mathematicalthinking.org`;
  }

  if (hostname === 'enc-test.mathematicalthinking.org') {
    return 'https://sso-test.mathematicalthinking.org';
  }

  return 'http://localhost:3002';
},

getMtLoginUrlWithRedirect() {
  return `${this.getMtSsoUrl()}/login?redirectURL=${this.getRedirectUrl()}`;
},

getMtSignupUrl() {
  return `${this.getMtSsoUrl()}/signup?redirectURL=${this.getRedirectUrl()}`;
}

});
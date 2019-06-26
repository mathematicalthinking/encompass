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
  return `${this.getMtSsoUrl()}/auth/login?redirectURL=${this.getRedirectUrl()}`;
},

getMtSignupUrl() {
  return `${this.getMtSsoUrl()}/auth/signup?redirectURL=${this.getRedirectUrl()}`;
},

getSsoGoogleUrl() {
  return `${this.getMtSsoUrl()}/auth/oauth/google?redirectURL=${this.getRedirectUrl()}`;
}

});
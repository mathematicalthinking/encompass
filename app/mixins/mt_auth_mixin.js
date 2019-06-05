Encompass.MtAuthMixin = Ember.Mixin.create({
getRedirectUrl() {
  return window.location.origin;
},

getMtLoginUrl() {
  let hostname = window.location.hostname;

  if (hostname === 'encompass.mathematicalthinking.org') {
    return `https://login.mathematicalthinking.org`;
  }

  if (hostname === 'enc-test.mathematicalthinking.org') {
    return 'https://test-login.mathematicalthinking.org';
  }

  return 'http://localhost:3002';
},

getMtLoginUrlWithRedirect() {
  return `${this.getMtLoginUrl()}?redirectURL=${this.getRedirectUrl()}`;
}

});
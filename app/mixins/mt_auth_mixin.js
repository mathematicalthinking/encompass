Encompass.MtAuthMixin = Ember.Mixin.create({
  //only used here
getRedirectUrl() {
  return window.location.origin;
},
//only used here
getMtSsoUrl() {
  let { host }  = window.location;
  if (host === 'prod1encompass.mathematicalthinking.org') {
    return `https://prod1sso.mathematicalthinking.org`;
  }
  if (host === 'encompass.mathematicalthinking.org') {
    return `https://sso.mathematicalthinking.org`;
  }

  if (host === 'enc-test.mathematicalthinking.org') {
    return 'https://sso-test.mathematicalthinking.org';
  }

  if (host === 'localhost:8082') {
    return 'http://localhost:3003';
  }

  return 'http://localhost:3002';
},
//only used here
getMtLoginUrlWithRedirect() {
  return `${this.getMtSsoUrl()}/auth/login?redirectURL=${this.getRedirectUrl()}`;
},
//only used here
getMtSignupUrl() {
  return `${this.getMtSsoUrl()}/auth/signup?redirectURL=${this.getRedirectUrl()}`;
},
//used in app/components/social-signin.js
getSsoGoogleUrl() {
  return `${this.getMtSsoUrl()}/oauth/google?redirectURL=${this.getRedirectUrl()}`;
},
//used in app/components/un-authorized.js
getContactEmail() {
  let { host }  = window.location;
  if (host === 'encompass.mathematicalthinking.org') {
    return 'encompassmath@gmail.com';
  }
  return 'encompassmathtesting@gmail.com';
}

});
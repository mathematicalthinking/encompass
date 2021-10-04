import Mixin from '@ember/object/mixin';

export default Mixin.create({
  getRedirectUrl() {
    return window.location.origin;
  },

  getMtSsoUrl() {
    let { host } = window.location;
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

  getMtLoginUrlWithRedirect() {
    return `${this.getMtSsoUrl()}/auth/login?redirectURL=${this.getRedirectUrl()}`;
  },

  getMtSignupUrl() {
    return `${this.getMtSsoUrl()}/auth/signup?redirectURL=${this.getRedirectUrl()}`;
  },

  getSsoGoogleUrl() {
    return `${this.getMtSsoUrl()}/oauth/google?redirectURL=${this.getRedirectUrl()}`;
  },

  getContactEmail() {
    let { host } = window.location;
    if (host === 'encompass.mathematicalthinking.org') {
      return 'encompassmath@gmail.com';
    }
    return 'encompassmathtesting@gmail.com';
  },
});

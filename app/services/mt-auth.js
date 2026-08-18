// app/services/mt-auth.js

import Service from '@ember/service';

export default class MtAuthService extends Service {
  getRedirectUrl() {
    return window.location.origin;
  }

  getMtSsoUrl() {
    let { host } = window.location;
    switch (host) {
      case 'encompass.mathematicalthinking.org':
        return 'https://sso.mathematicalthinking.org';
      case 'enc-test.mathematicalthinking.org':
        return 'https://sso-test.mathematicalthinking.org';
      case 'enc-test1.mathematicalthinking.org':
        return 'https://sso-test1.mathematicalthinking.org';
      case 'enc-staging.mathematicalthinking.org':
        return 'https://sso-staging.mathematicalthinking.org';
      case 'localhost:8082':
        return 'http://localhost:3003';
      default:
        return 'http://localhost:3002';
    }
  }

  getMtLoginUrlWithRedirect() {
    return `${this.getMtSsoUrl()}/auth/login?redirectURL=${this.getRedirectUrl()}`;
  }

  getMtSignupUrl() {
    return `${this.getMtSsoUrl()}/auth/signup?redirectURL=${this.getRedirectUrl()}`;
  }

  getSsoGoogleUrl() {
    return `${this.getMtSsoUrl()}/oauth/google?redirectURL=${this.getRedirectUrl()}`;
  }

  getContactEmail() {
    let { host } = window.location;
    return host === 'encompass.mathematicalthinking.org'
      ? 'encompassmath@gmail.com'
      : 'encompassmathtesting@gmail.com';
  }
}

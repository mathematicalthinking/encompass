import Component from '@ember/component';
import { action, computed } from '@ember/object';
import $ from 'jquery';
import ErrorHandlingMixin from '../mixins/error_handling_mixin';

export default Component.extend(ErrorHandlingMixin, {
  tagName: '',
  classNames: ['login-page'],
  incorrectPassword: false,
  incorrectUsername: false,
  missingCredentials: false,
  postErrors: [],

  oauthErrorMsg: computed('oauthError', function () {
    if (this.oauthError === 'emailUnavailable') {
      return 'The provided email address is already associated with an existing account';
    }
  }),
  
  @action
  resetErrors() {
    const errors = [
      'incorrectUsername',
      'incorrectPassword',
      'missingCredentials',
    ];

    for (let error of errors) {
      if (this.get(error)) {
        this.set(error, false);
      }
    }
  },

  @action
  login() {
    var username = this.get('username');
    var usernameTrim;
    if (username) {
      usernameTrim = username.trim();
    } else {
      usernameTrim = '';
    }
    var password = this.get('password');

    if (!usernameTrim || !password) {
      this.set('missingCredentials', true);
      return;
    }
    var createUserData = {
      username: usernameTrim,
      password: password,
    };
    $.post({
      url: '/auth/login',
      data: createUserData,
    })
      .then((res) => {
        if (res.message === 'Incorrect password') {
          this.set('incorrectPassword', true);
        } else if (res.message === 'Incorrect username') {
          this.set('incorrectUsername', true);
        } else {
          window.location.href = '/';
        }
      })
      .catch((err) => {
        this.handleErrors(err, 'postErrors');
      });
  },
});

import ErrorHandlingComponent from './error-handling';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
// Used for when a logged in user is resetting either their own password or another user's password

export default class ResetPasswordUserComponent extends ErrorHandlingComponent {
  @service('sweet-alert') alert;
  @tracked postErrors = [];
  @tracked password = '';
  @tracked confirmPassword = '';
  @tracked showingPassword = false;
  @tracked missingRequiredFields = false;
  @tracked matchError = false;
  @tracked resetError = '';

  get doPasswordsMatch() {
    return this.password === this.confirmPassword;
  }

  get fieldType() {
    return this.showingPassword ? 'text' : 'password';
  }

  @action async resetPassword() {
    const password = this.password;
    const confirmPassword = this.confirmPassword;

    if (!password || !confirmPassword) {
      this.missingRequiredFields = true;
    }

    if (!this.doPasswordsMatch) {
      this.matchError = true;
      return;
    }

    const ssoId = this.args.user.ssoId;

    try {
      const response = await fetch('/auth/resetuser', {
        method: 'POST',
        body: new URLSearchParams({ password, ssoId }),
      });

      if (!response.ok) {
        let errorBody = null;
        try {
          errorBody = await response.json();
        } catch (_parseErr) {
          // non-JSON error body
        }
        this.handleErrors(
          errorBody || {
            errors: [{ detail: `Reset failed with status ${response.status}` }],
          },
          'postErrors'
        );
        return;
      }

      const res = await response.json();
      if (res._id && res._id === ssoId) {
        this.alert.showToast(
          'success',
          'Password Reset',
          'bottom-end',
          3000,
          false,
          null
        );
        this.args.handleResetSuccess(res);
      } else {
        this.resetError =
          res.info || 'Could not complete reset. Please try again.';
      }
    } catch (err) {
      this.handleErrors(err, 'postErrors');
    }
  }

  @action cancelReset() {
    this.args.cancelReset();
  }

  @action toggleShowingPassword() {
    this.showingPassword = !this.showingPassword;
  }

  @action resetErrors() {
    const errors = ['matchError', 'missingRequiredFields'];
    for (let error of errors) {
      if (this[error]) {
        this[error] = false;
      }
    }
  }
}

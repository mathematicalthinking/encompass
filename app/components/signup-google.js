import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class SignupGoogleComponent extends Component {
  @service('current-user') currentUser;
  @service('error-handling') errorHandling;

  @tracked missingCredentials = false;
  @tracked noTermsAndConditions = false;
  @tracked agreedToTerms = false;
  @tracked org = null;
  @tracked location = null;
  @tracked requestReason = null;

  typeaheadHeader = '<label class="tt-header">Popular Organizations:</label>';

  get updateUserErrors() {
    return this.errorHandling.getErrors('updateUserErrors') || [];
  }

  // The typeahead reports the typed string (on input) or the selected org
  // record (on pick) via @onSelect; submit handles both.
  @action
  setOrg(value) {
    this.org = value;
  }

  @action
  resetErrors() {
    this.missingCredentials = false;
    this.noTermsAndConditions = false;
  }

  @action
  submit() {
    let organization = this.org;
    const location = this.location;
    const requestReason = this.requestReason;

    if (!organization || !location || !requestReason) {
      this.missingCredentials = true;
      return;
    }

    if (!this.agreedToTerms) {
      this.noTermsAndConditions = true;
      return;
    }

    const user = this.currentUser.user;
    let orgRequest;

    // make sure user did not type in an existing org
    if (typeof organization === 'string') {
      const orgs = this.args.organizations;
      const matchingOrg = orgs.findBy('name', organization);
      if (matchingOrg) {
        organization = matchingOrg;
      } else {
        orgRequest = organization;
      }
    }

    if (orgRequest) {
      user.organizationRequest = orgRequest;
    } else {
      user.organization = organization;
    }

    user.location = location;
    user.requestReason = requestReason;
    user.createdBy = user;

    user.save().catch((err) => {
      this.errorHandling.handleErrors(err, 'updateUserErrors', user);
    });
  }
}

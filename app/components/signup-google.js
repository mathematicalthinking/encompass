import Component from '@ember/component';
import CurrentUserMixin from '../mixins/current_user_mixin';
import ErrorHandlingMixin from '../mixins/error_handling_mixin';






export default Component.extend(CurrentUserMixin, ErrorHandlingMixin, {
  elementId: 'signup-google',
  missingCredentials: false,
  noTermsAndConditions: false,
  agreedToTerms: false,
  org: null,
  updateUserErrors: [],

  init: function () {
    this._super(...arguments);
    this.set('typeaheadHeader', '<label class="tt-header">Popular Organizations:</label>');
  },

  actions: {
    submit: function () {
      let organization = this.org;
      const location = this.location;
      const requestReason = this.requestReason;

      if (!organization || !location || !requestReason) {
        this.set('missingCredentials', true);
        return;
      }

      if (!this.agreedToTerms) {
        this.set('noTermsAndConditions', true);
        return;
      }

      let user = this.currentUser;
      let orgRequest;

      // make sure user did not type in existing org
      if (typeof organization === 'string') {
        let orgs = this.organizations;
        let matchingOrg = orgs.findBy('name', organization);
        if (matchingOrg) {
          organization = matchingOrg;
        } else {
          orgRequest = organization;
        }
      }

      if (orgRequest) {
        user.set('organizationRequest', orgRequest);
      } else {
        user.set('organization', organization);
      }

      user.set('location', location);
      user.set('requestReason', requestReason);
      user.set('createdBy', user);

      user.save().then((res) => {
        // handle success
      }).catch((err) => {
        this.handleErrors(err, 'updateUserErrors', user);
      });
    },
    resetErrors(e) {
      const errors = ['missingCredentials', 'noTermsAndConditions'];

      for (let error of errors) {
        if (this.get(error)) {
          this.set(error, false);
        }
      }
    },
  },


});
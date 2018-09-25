Encompass.SignupGoogleComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {
  elementId: 'signup-google',
  missingCredentials: false,
  noTermsAndConditions: false,
  agreedToTerms: false,
  org: null,
  updateUserErrors: [],

  init: function() {
    this._super(...arguments);
    this.set('typeaheadHeader', '<label class="tt-header">Popular Organizations:</label>');
  },

  actions: {
    submit: function () {
      const organization = this.get('org');
      const location = this.get('location');
      const requestReason = this.get('requestReason');

      if (!organization || !location || !requestReason) {
        this.set('missingCredentials', true);
        return;
      }

      if (!this.get('agreedToTerms')) {
        this.set('noTermsAndConditions', true);
        return;
      }

      let user = this.get('currentUser');

      if (typeof organization === 'string') {
        user.set('organizationRequest', organization);
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
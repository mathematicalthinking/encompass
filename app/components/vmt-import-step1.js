Encompass.VmtImportStep1Component = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'vmt-import-step1',

  alert: Ember.inject.service('sweet-alert'),

  isUnverified: Ember.computed.not('isVerified'),

  isVerified: function() {
    return this.get('currentUser.vmtUserInfo.token.length') > 0;
  }.property('currentUser.vmtUserInfo.token'),

  actions: {
    logout() {
      this.get('currentUser').set('vmtUserInfo', {});
      this.get('currentUser').save();
    },
    handleLoginResults(results) {
      /*
      user: {
        token,
        username,
        _id: vmt userId
      }
      */

      if (!results || !results.user) {
        return;
      }
      let { username, _id, token } = results.user;

      this.get('currentUser').setProperties({
        'vmtUserInfo.username': username,
        'vmtUserInfo.token': token,
        'vmtUserInfo.userId': _id
      });

      this.get('currentUser').save()
        .then(() => {
          this.get('alert').showToast('success', 'Vmt Credentials Verified', 'bottom-end', 3000, false, null);
        });
    },

    next() {
      if (this.get('isUnverified')) {
        this.set('verificationError', 'Please provide your VMT credentials in order to proceed');
        return;
      }
      this.get('onProceed')();
    }
  }
});
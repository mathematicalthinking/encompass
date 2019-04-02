Encompass.VmtImportContainerComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {

  vmtUsername: null,
  vmtUserId: null,

  currentUserToken: function() {
    return this.get('currentUser.vmtToken');
  }.property('currentUser.vmtToken'),

  actions: {
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

      this.set('vmtUsername', username);
      this.set('vmtUserId', _id);

      this.get('currentUser').set('vmtToken', token);
      this.get('currentUser').save();
    },

    handleSearchResults(results) {
      let { isInvalidToken } = results;

      if (isInvalidToken) {
        this.set('tokenError', 'Please reenter your VMT credentials');
        this.get('currentUser').set('vmtToken', null);
        this.get('currentUser').save();
        return;
      }

      this.set('searchResults', results);

    }
  }

});
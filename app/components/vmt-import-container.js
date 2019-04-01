Encompass.VmtImportContainerComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {

  vmtUsername: null,
  vmtUserId: null,

  currentUserToken: function() {
    return this.get('currentUser.vmtToken');
  }.property('currentUser.vmtToken'),

  actions: {
    handleLoginResults(results) {
      // what format?
      /*
      user: {
        token,
        username,
        _id: vmt userId
      }
      */
     console.log('results in hlr', results);
      if (!results || !results.user) {
        return;
      }
      let { username, _id, token } = results.user;

      // this.set('vmtToken', token);
      this.set('vmtUsername', username);
      this.set('vmtUserId', _id);

      this.get('currentUser').set('vmtToken', token);
      this.get('currentUser').save();
    },

    handleSearchResults(results) {

    }
  }

});
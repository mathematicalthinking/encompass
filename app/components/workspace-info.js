Encompass.WorkspaceInfoComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'workspace-info',
  comments: Ember.inject.controller,
  isEditing: false,
  selectedValue: null,
  searchText: "",

  searchResults: function () {
    var searchText = this.get('searchText');
    searchText = searchText.replace(/\W+/g, "");
    if (searchText.length < 2) {
      return;
    }

    var people = this.store.find('user', {
      name: searchText
    });
    return people;
  }.property('searchText'),

  canEdit: function () {
    console.log('current model', this.get('model'));
    var canEdit = Permissions.userCanModifyWorkspace(this.get('currentUser'), this.get('workspace'));
    return canEdit;
  }.property('workspace.owner'),


  modes: function () {
    return Permissions.modeValues();
  }.property(),

  actions: {
    removeEditor: function (editor) {
        var workspace = this.get('model');
        workspace.get('editors').removeObject(editor);
    },

    addEditor: function (editor) {
      var workspace = this.get('model');
      if (!workspace.get('editors').contains(editor)) {
        workspace.get('editors').pushObject(editor);
      }
    },

    changeMode: function () {
      var mode = this.get('selectedMode');
      console.log('current mode is', mode);
      var workspace = this.get('model');
      console.log('current model inside changemode is', workspace);
      workspace.set('mode', mode);
      workspace.save();
    },

    editWorkspace: function () {
      this.set('isEditing', true);
    },

    saveWorkspace: function () {
      // this.actions.changeMode.call(this);
      var workspace = this.get('model');
      workspace.save().then(function () {
        this.set('isEditing', false);
      });
    }
  }

});




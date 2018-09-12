Encompass.WorkspaceInfoComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'workspace-info',
  comments: Ember.inject.controller,
  isEditing: false,
  selectedMode: null,
  searchText: "",

  setSearchResults: function () {
    var searchText = this.get('searchText');
    console.log('search text is', searchText);
    searchText = searchText.replace(/\W+/g, "");
    if (searchText.length < 2) {
      return;
    }

    this.get('store').query('user', {
      usernameSearch: searchText,
    }).then((people) => {
      this.set('editorSearchResults', people.rejectBy('accountType', 'S'));
    });
  }.observes('searchText'),


  canEdit: Ember.computed('workspace.id', function () {
    let workspace = this.get('workspace');
    let owner = workspace.get('owner');
    let creator = owner.get('content');
    let currentUser = this.get('currentUser');

    let canEdit = creator.id === currentUser.id ? true : false;
    return canEdit;
  }),

  modes: function () {
    return Permissions.modeValues();
  }.property(),

  actions: {
    removeEditor: function (editor) {
        var workspace = this.get('workspace');
        workspace.get('editors').removeObject(editor);
    },

    addEditor: function (editor) {
      var workspace = this.get('workspace');
      if (!workspace.get('editors').contains(editor)) {
        workspace.get('editors').pushObject(editor);
      }
    },

    editWorkspace: function () {
      this.set('isEditing', true);
      let workspace = this.get('workspace');
      this.set('selectedMode', workspace.get('mode'));
    },

    saveWorkspace: function () {
      // this.actions.changeMode.call(this);
      this.set('isEditing', false);
      var mode = this.get('selectedMode');
      console.log('selected mode is', mode);
      var workspace = this.get('workspace');
      workspace.set('mode', mode);
      workspace.save();

    }
  }

});




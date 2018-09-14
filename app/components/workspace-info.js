Encompass.WorkspaceInfoComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'workspace-info',
  comments: Ember.inject.controller,
  isEditing: false,
  selectedMode: null,
  searchText: "",


  willDestroyElement: function () {
    let workspace = this.get('workspace');
    workspace.save();
    this._super(...arguments);
  },

  setSearchResults: function () {
    let searchText = this.get('searchText');
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

  setOwnerResults: function () {
    let owner = this.get('owner');
    owner = owner.replace(/\W+/g, "");
    if (owner.length < 2) {
      return;
    }

    this.get('store').query('user', {
      usernameSearch: owner,
    }).then((people) => {
      this.set('ownerSearchResults', people.rejectBy('accountType', 'S'));
    });
  }.observes('owner'),


  canEdit: Ember.computed('workspace.id', function () {
    let workspace = this.get('workspace');
    let owner = workspace.get('owner');
    let creator = owner.get('content');
    let currentUser = this.get('currentUser');
    let accountType = currentUser.get('accountType');
    let isAdmin = accountType === "A" ? true : false;
    let isOwner = creator.id === currentUser.id ? true : false;

    let canEdit = isAdmin || isOwner;
    return canEdit;
  }),

  modes: function () {
    return Permissions.modeValues();
  }.property(),

  actions: {
    removeEditor: function (editor) {
      let workspace = this.get('workspace');
      workspace.get('editors').removeObject(editor);
    },

    addEditor: function (editor) {
      let workspace = this.get('workspace');
      if (!workspace.get('editors').contains(editor)) {
        workspace.get('editors').pushObject(editor);
      }
    },

    editOwner: function () {
      this.set('isChangingOwner', true);
    },

    changeOwner: function (owner) {
      let workspace = this.get('workspace');
      console.log('owner is in changeOwner', owner);
      workspace.set('owner', owner);
      workspace.save();
      this.set('isChangingOwner', false);
    },

    editWorkspace: function () {
      this.set('isEditing', true);
      let workspace = this.get('workspace');
      this.set('selectedMode', workspace.get('mode'));
    },

    saveWorkspace: function () {
      // this.actions.changeMode.call(this);
      this.set('isEditing', false);
      let mode = this.get('selectedMode');
      console.log('selected mode is', mode);
      let workspace = this.get('workspace');
      workspace.set('mode', mode);
      workspace.save();

    }
  }

});




/**
 * Passed in from parent:
 * - folders
 * - workspace (the current workspace)
 * - currentUser
 * - fileSelection (action)
 * - store: The data store for adding new folders.
 *
 * TODO:
 * - putInFolder (needs drag n drop)
 * - putInWorkspace (is this really used?)
 * - openModal action to add a new folder
 */
Encompass.FolderListComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {
  elementId: 'folder-list',
  classNames: ['workspace-flex-item', 'folders'],
  classNameBindings: ['isHidden:hidden'],
  alert: Ember.inject.service('sweet-alert'),
  utils: Ember.inject.service('utility-methods'),
  weighting: 1,
  editFolderMode: false,
  sortProperties: ['weight', 'name'],
  createRecordErrors: [],
  updateRecordErrors: [],
  permissions: Ember.inject.service('workspace-permissions'),


  canManageFolders: function() {
    return this.get('canCreate') || this.get('canEdit') || this.get('canDelete');
  }.property('canCreate', 'canDelete', 'canEdit'),

  canCreate: function() {
    let ws = this.get('workspace');
    return this.get('permissions').canEdit(ws, 'folders', 2);
  }.property('workspace.id', 'currentUser.id'),

  canEdit: function() {
    let ws = this.get('workspace');
    return this.get('permissions').canEdit(ws, 'folders', 3);
  }.property('workspace.id', 'currentUser.id'),

  canDelete: function() {
    let ws = this.get('workspace');
    return this.get('permissions').canEdit(ws, 'folders', 3);
  }.property('workspace.id', 'currentUser.id'),

  init: function() {
    this._super(...arguments);
  },

  topLevelFolders: function() {
    return this.get('folders').filter((folder) => {
      let parentId = this.get('utils').getBelongsToId(folder, 'parent');

      return this.get('utils').isNullOrUndefined(parentId);
    });
  }.property('folders.@each.parent'),


  sortedFolders: Ember.computed.sort('topLevelFolders', 'sortProperties'),

  siblings: function(folder, above) {
    let parentId = this.get('utils').getBelongsToId(folder, 'parent');

    let siblings = this.get('folders').filter((folder) => {
      let id = this.get('utils').getBelongsToId(folder, 'parent');
      return id === parentId;
    });
    let sortedSiblings = siblings.sortBy('weight', 'name');

    let pos = sortedSiblings.indexOf(folder);
    let siblingsAbove = sortedSiblings.slice(0, pos);
    let siblingsBelow = sortedSiblings.slice(pos + 1, sortedSiblings.length);

    return (above) ? siblingsAbove : siblingsBelow;
  },

  toggleDisplayText: function() {
    if (this.get('isHidden')) {
      return 'Show Folders';
    }
    return 'Hide Folders';
  }.property('isHidden'),

  editFolderText: function() {
    return this.get('editFolderMode') ? 'Done' : 'Edit';
  }.property('editFolderMode'),
  editFolderIcon: function() {
    return this.get('editFolderMode') ? 'folder-checked' : 'folder-info';
  }.property('editFolderMode'),
  toggleEditAlt: function() {
    return this.get('editFolderMode') ? 'Save Changes' : 'Edit Folders';
  }.property('editFolderMode'),

  actions: {
    openModal: function(){
      this.get('alert').showPrompt('text', 'Create New Folder', null, 'Save').then((result) => {
        if (result.value) {
          this.send('createFolder', result.value);
        }
      });
    },

    createFolder: function(folderName){
      var ws = this.workspace;
      var currentUser = this.get('currentUser');

      if(folderName) {
        var folder = this.store.createRecord('folder', {
          name: folderName,
          workspace: ws,
          weight: 0,
          createdBy: currentUser,
        });

        folder.save().then(() => {
          this.get('alert').showToast('success', `${folderName} created`, 'bottom-end', 3000, false, null);
        }).catch((err) => {
          let message = err.errors[0].detail;
          this.handleErrors(err, 'createRecordErrors', folder);
          this.get('alert').showToast('error', `${message}`, 'bottom-end', 4000, false, null);
          folder.deleteRecord();
        });
      }
    },

    askToDelete: function(folder) {
      let folderName = folder.get('name');
      this.get('alert').showModal('warning', `Are you sure you want to delete ${folderName}`, null, 'Yes, delete it')
      .then((result) => {
        if (result.value) {
          this.send('confirmDelete', folder);
        }
      });
    },

    confirmDelete: function(folder) {
      let folderName = folder.get('name');
      folder.set('isTrashed', true);
      folder.save().then((folder) => {
        this.get('alert').showToast('success', `${folderName} deleted`, 'bottom-end', 5000, false, null);
      }).catch((err) => {
        let message = err.errors[0].detail;
        this.get('alert').showToast('error', `${message}`, 'bottom-end', 4000, false, null);
        this.handleErrors(err, 'updateRecordErrors', folder);
      });
    },

    fileSelectionInFolder: function(objId, folder){
      this.sendAction( 'fileSelection', objId, folder );
    },

    activateEditFolderMode: function() {
      this.set('editFolderMode', true);
    },

    cancelEditFolderMode: function() {
      this.set('editFolderMode', false);
    },
    toggleEditMode: function() {
      this.toggleProperty('editFolderMode');
    },

    moveOut: function(folder) {
      var parent = folder.get('parent');
      var newParent = parent.get('parent');
      // var weight = parent.get('weight');
      // var anchor = this.weighting;
      // var copy;

      //controller.propertyWillChange('content');
      //
      if(parent) { // move out only if this is a nested folder
        parent.get('children').removeObject(folder);

        if( newParent.get("isTruthy") === false  ) {
          folder.set('isTopLevel', true);
        }
        else {
          folder.set('isTopLevel', false);
          newParent.get('children').addObject(folder);
        }

        folder.save().then((res) => {
          // handle success
        }).catch((err) => {
          this.handleErrors(err, 'updateRecordErrors', folder);
        });
      }
    },

    moveUp: function(folder) {
      var weight = folder.get('weight');
      var siblings = this.siblings(folder, true);
      var anchor = this.weighting;
      var min = siblings.get('lastObject.weight');

      //console.debug(siblings.length);

      if(siblings.length > 0) { //re-order only if there are siblings above
        if (weight !== min) { // swap the two folders' weights if they are different
          folder.set('weight', min);
          siblings.get('lastObject').set('weight', weight);
          folder.save();

          siblings.get('lastObject').save();
        } else {
          folder.set('weight', (weight - anchor));
          folder.save();

          // need to also increment the siblings below the one
          // this folder is switching with, so they stay below it
          siblings.forEach( function(sibling, index){
            if( index !== 0 ){
              var w = sibling.get('weight');
              sibling.set('weight', (w + anchor));
              sibling.save();
            }
          });
        }
      }
    },

    moveDown: function(folder) {
      var weight = folder.get('weight');
      var siblings = this.siblings(folder, false);
      var anchor = this.weighting;
      var max = siblings.get('firstObject.weight');

      if(siblings.length > 0) { //re-order only if there are siblings below
        if (weight !== max) { // swap the two folders' weights if they are different
          folder.set('weight', max);
          folder.save();

          siblings.get('firstObject').set('weight', weight);
          siblings.get('firstObject').save();
        } else {
          folder.set('weight', (weight + anchor));
          folder.save();

          // need to also increment the siblings below the one
          // this folder is switching with, so they stay below it
          siblings.forEach( function(sibling, index){
            if( index !== 0 ){
              var w = sibling.get('weight');
              sibling.set('weight', (w + anchor));
              sibling.save();
            }
          });
        }
      }
    },
    hideFolders() {
      this.get('hideFolders')();
    }
  }
});


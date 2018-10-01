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
  alert: Ember.inject.service('sweet-alert'),
  weighting: 1,
  editFolderMode: false,
  canManageFolders: true,
  sortProperties: ['weight', 'name'],
  createRecordErrors: [],
  updateRecordErrors: [],
  /*
  canManageFolders: function() {
    return Permissions.userCan(
      this.get('currentUser'),
      this.get('currentWorkspace'),
      "FOLDERS"
    );
  }.property('currentUser', 'workspace.owner', 'workspace.editors.[].username'),
  */
  init: function() {
    this._super(...arguments);
  },

  filteredFolders: function() {
    return this.folders
      .filterBy('isTrashed', false)
      .filterBy('parent.content', null);

    /*
    var sortedFolders = filteredFolders.sortBy("weight name");
    var sortedContent = Ember.ArrayProxy.createWithMixins(Ember.SortableMixin,
      { content: filteredContent, sortProperties: this.sortProperties });
      */
    //return filteredFolders;
  }.property('folders.@each.{isTrashed,parent}'),

  sortedFolders: Ember.computed.sort('filteredFolders', 'sortProperties'),

  siblings: function(folder, above) {
        //workspace = controller.get('currentWorkspace'),
    var parentID = (folder.get('parent')) ? folder.get('parent').get('id') : null;
    var weight = folder.get('weight');
    var workspaceFolders = this.folders
          .filterBy('parent.id', parentID)
          .sortBy('weight', 'name');

    var pos = workspaceFolders.indexOf(folder);
    var siblingsAbove = workspaceFolders.slice(0, pos);
    var siblingsBelow = workspaceFolders.slice(pos+1, workspaceFolders.length);

    return (above) ? siblingsAbove : siblingsBelow;
  },

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
          this.handleErrors(err, 'createRecordErrors', folder);
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

    moveOut: function(folder) {
      console.log("Move Out folder List! " + folder.get('name') );
      var parent = folder.get('parent');
      var newParent = parent.get('parent');
      var weight = parent.get('weight');
      var anchor = this.weighting;
      var copy;

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
  }
});


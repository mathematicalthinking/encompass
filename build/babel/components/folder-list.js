'use strict';

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
Encompass.FolderListComponent = Ember.Component.extend({
  hideNewFolderModal: true,
  hideDeleteFolderModal: true,
  weighting: 1,
  editFolderMode: false,
  canManageFolders: true,
  sortProperties: ['weight', 'name'],
  /*
  canManageFolders: function() {
    return Permissions.userCan(
      this.get('currentUser'),
      this.get('currentWorkspace'),
      "FOLDERS"
    );
  }.property('currentUser', 'workspace.owner', 'workspace.editors.[].username'),
  */

  filteredFolders: function () {
    return this.folders.filterBy('isTrashed', false).filterBy('parent.content', null);

    /*
    var sortedFolders = filteredFolders.sortBy("weight name");
    var sortedContent = Ember.ArrayProxy.createWithMixins(Ember.SortableMixin,
      { content: filteredContent, sortProperties: this.sortProperties });
      */
    //return filteredFolders;
  }.property('folders.[]', 'folders.@each.{isTrashed,parent}'),

  sortedFolders: Ember.computed.sort('filteredFolders', 'sortProperties'),

  siblings: function siblings(folder, above) {
    //workspace = controller.get('currentWorkspace'),
    var parentID = folder.get('parent') ? folder.get('parent').get('id') : null;
    var weight = folder.get('weight');
    var workspaceFolders = this.folders.filterBy('parent.id', parentID).sortBy('weight', 'name');

    var pos = workspaceFolders.indexOf(folder);
    var siblingsAbove = workspaceFolders.slice(0, pos);
    var siblingsBelow = workspaceFolders.slice(pos + 1, workspaceFolders.length);

    return above ? siblingsAbove : siblingsBelow;
  },

  actions: {
    openModal: function openModal(modalName) {
      console.log("Open Modal: " + modalName);
      this.set('hideNewFolderModal', false);
    },

    createFolder: function createFolder(folderName) {
      console.log("Create folder named: " + folderName);
      var ws = this.workspace;

      if (folderName) {
        var folder = this.store.createRecord('folder', {
          name: folderName,
          workspace: ws,
          weight: 0
        });

        folder.save();
      }
    },

    askToDelete: function askToDelete(folder) {
      this.set('folderToDelete', folder);
      this.set('hideDeleteFolderModal', false);
    },

    confirmDelete: function confirmDelete() {
      var folder = this.get('folderToDelete');
      folder.set('isTrashed', true);
      folder.save();
    },

    fileSelectionInFolder: function fileSelectionInFolder(objId, folder) {
      console.log("Folder List File Selection Action: " + objId + " in folder " + folder.get('name'));
      this.sendAction('fileSelection', objId, folder);
    },

    testAction: function testAction() {
      console.log("Test clicked: " + this.folderTest);
    },

    activateEditFolderMode: function activateEditFolderMode() {
      this.set('editFolderMode', true);
    },

    cancelEditFolderMode: function cancelEditFolderMode() {
      this.set('editFolderMode', false);
    },

    moveOut: function moveOut(folder) {
      console.log("Move Out folder List! " + folder.get('name'));
      var parent = folder.get('parent');
      var newParent = parent.get('parent');
      var weight = parent.get('weight');
      var anchor = this.weighting;
      var copy;

      //controller.propertyWillChange('content');
      //
      if (parent) {
        // move out only if this is a nested folder
        parent.get('children').removeObject(folder);

        if (newParent.get("isTruthy") === false) {
          folder.set('isTopLevel', true);
        } else {
          folder.set('isTopLevel', false);
          newParent.get('children').addObject(folder);
        }

        folder.save();
      }
    },

    moveUp: function moveUp(folder) {
      var weight = folder.get('weight');
      var siblings = this.siblings(folder, true);
      var anchor = this.weighting;
      var min = siblings.get('lastObject.weight');

      //console.debug(siblings.length);

      if (siblings.length > 0) {
        //re-order only if there are siblings above
        if (weight !== min) {
          // swap the two folders' weights if they are different
          folder.set('weight', min);
          siblings.get('lastObject').set('weight', weight);
          folder.save();

          siblings.get('lastObject').save();
        } else {
          folder.set('weight', weight - anchor);
          folder.save();

          // need to also increment the siblings below the one
          // this folder is switching with, so they stay below it
          siblings.forEach(function (sibling, index) {
            if (index !== 0) {
              var w = sibling.get('weight');
              sibling.set('weight', w + anchor);
              sibling.save();
            }
          });
        }
      }
    },

    moveDown: function moveDown(folder) {
      var weight = folder.get('weight');
      var siblings = this.siblings(folder, false);
      var anchor = this.weighting;
      var max = siblings.get('firstObject.weight');

      if (siblings.length > 0) {
        //re-order only if there are siblings below
        if (weight !== max) {
          // swap the two folders' weights if they are different
          folder.set('weight', max);
          folder.save();

          siblings.get('firstObject').set('weight', weight);
          siblings.get('firstObject').save();
        } else {
          folder.set('weight', weight + anchor);
          folder.save();

          // need to also increment the siblings below the one
          // this folder is switching with, so they stay below it
          siblings.forEach(function (sibling, index) {
            if (index !== 0) {
              var w = sibling.get('weight');
              sibling.set('weight', w + anchor);
              sibling.save();
            }
          });
        }
      }
    }
  }
});
//# sourceMappingURL=folder-list.js.map

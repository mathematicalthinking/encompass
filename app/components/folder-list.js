import Component from '@ember/component';
import { computed } from '@ember/object';
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
import { equal, sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import ErrorHandlingMixin from '../mixins/error_handling_mixin';

export default Component.extend(ErrorHandlingMixin, {
  elementId: 'folder-list',
  classNames: ['workspace-flex-item', 'folders'],
  classNameBindings: [
    'isHidden:hidden',
    'isBipaneled:bi-paneled',
    'isTripaneled:tri-paneled',
    'editFolderMode:is-editing',
  ],
  alert: service('sweet-alert'),
  utils: service('utility-methods'),
  weighting: 1,
  editFolderMode: false,
  sortProperties: ['weight', 'name'],
  createRecordErrors: [],
  updateRecordErrors: [],
  permissions: service('workspace-permissions'),

  isBipaneled: equal('containerLayoutClass', 'fsh'),
  isTripaneled: equal('containerLayoutClass', 'fsc'),

  canManageFolders: computed('canCreate', 'canDelete', 'canEdit', function () {
    return this.canCreate || this.canEdit || this.canDelete;
  }),

  canCreate: computed('workspace.id', 'currentUser.id', function () {
    let ws = this.workspace;
    return this.permissions.canEdit(ws, 'folders', 2);
  }),

  canEdit: computed('workspace.id', 'currentUser.id', function () {
    let ws = this.workspace;
    return this.permissions.canEdit(ws, 'folders', 3);
  }),

  canDelete: computed('workspace.id', 'currentUser.id', function () {
    let ws = this.workspace;
    return this.permissions.canEdit(ws, 'folders', 3);
  }),

  topLevelFolders: computed('folders.@each.parent', function () {
    return this.folders.filter((folder) => {
      let parentId = this.utils.getBelongsToId(folder, 'parent');

      return this.utils.isNullOrUndefined(parentId);
    });
  }),

  sortedFolders: sort('topLevelFolders', 'sortProperties'),

  siblings: function (folder, above) {
    let parentId = this.utils.getBelongsToId(folder, 'parent');

    let siblings = this.folders.filter((folder) => {
      let id = this.utils.getBelongsToId(folder, 'parent');
      return id === parentId;
    });
    let sortedSiblings = siblings.sortBy('weight', 'name');

    let pos = sortedSiblings.indexOf(folder);
    let siblingsAbove = sortedSiblings.slice(0, pos);
    let siblingsBelow = sortedSiblings.slice(pos + 1, sortedSiblings.length);

    return above ? siblingsAbove : siblingsBelow;
  },

  toggleDisplayText: computed('isHidden', function () {
    if (this.isHidden) {
      return 'Show Folders';
    }
    return 'Hide Folders';
  }),

  editFolderText: computed('editFolderMode', function () {
    return this.editFolderMode ? 'Done' : 'Edit';
  }),
  editFolderIcon: computed('editFolderMode', function () {
    return this.editFolderMode ? 'fas fa-check' : 'fas fa-pencil-alt';
  }),
  toggleEditAlt: computed('editFolderMode', function () {
    return this.editFolderMode ? 'Save Changes' : 'Edit Folders';
  }),

  actions: {
    openModal: function () {
      this.alert
        .showPrompt('text', 'Create New Folder', null, 'Save')
        .then((result) => {
          if (result.value) {
            this.send('createFolder', result.value);
          }
        });
    },

    createFolder: function (folderName) {
      var ws = this.workspace;
      var currentUser = this.currentUser;

      if (folderName) {
        var folder = this.store.createRecord('folder', {
          name: folderName,
          workspace: ws,
          weight: 0,
          createdBy: currentUser,
        });

        folder
          .save()
          .then(() => {
            this.alert.showToast(
              'success',
              `${folderName} created`,
              'bottom-end',
              3000,
              false,
              null
            );
          })
          .catch((err) => {
            let message = err.errors[0].detail;
            this.handleErrors(err, 'createRecordErrors', folder);
            this.alert.showToast(
              'error',
              `${message}`,
              'bottom-end',
              4000,
              false,
              null
            );
            folder.deleteRecord();
          });
      }
    },

    askToDelete: function (folder) {
      let folderName = folder.get('name');
      this.alert
        .showModal(
          'warning',
          `Are you sure you want to delete ${folderName}`,
          null,
          'Yes, delete it'
        )
        .then((result) => {
          if (result.value) {
            this.send('confirmDelete', folder);
          }
        });
    },

    confirmDelete: function (folder) {
      let folderName = folder.get('name');
      folder.set('isTrashed', true);
      folder
        .save()
        .then((folder) => {
          this.alert.showToast(
            'success',
            `${folderName} deleted`,
            'bottom-end',
            3000,
            false,
            null
          );
        })
        .catch((err) => {
          let message = err.errors[0].detail;
          this.alert.showToast(
            'error',
            `${message}`,
            'bottom-end',
            3000,
            false,
            null
          );
          this.handleErrors(err, 'updateRecordErrors', folder);
        });
    },

    fileSelectionInFolder: function (objId, folder) {
      this.sendAction('fileSelection', objId, folder);
    },

    activateEditFolderMode: function () {
      this.set('editFolderMode', true);
    },

    cancelEditFolderMode: function () {
      this.set('editFolderMode', false);
    },
    toggleEditMode: function (currentMode) {
      this.send('hideComments', currentMode);
      this.toggleProperty('editFolderMode');
    },

    moveOut: function (folder) {
      var parent = folder.get('parent');
      var newParent = parent.get('parent');
      // var weight = parent.get('weight');
      // var anchor = this.weighting;
      // var copy;

      //controller.propertyWillChange('content');
      //
      if (parent) {
        // move out only if this is a nested folder
        parent.get('children').removeObject(folder);

        if (newParent.get('isTruthy') === false) {
          folder.set('isTopLevel', true);
        } else {
          folder.set('isTopLevel', false);
          newParent.get('children').addObject(folder);
        }

        folder
          .save()
          .then((res) => {
            // handle success
          })
          .catch((err) => {
            this.handleErrors(err, 'updateRecordErrors', folder);
          });
      }
    },

    moveUp: function (folder) {
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

    moveDown: function (folder) {
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
    },
    hideFolders() {
      this.hideFolders();
    },
    hideComments(currentMode) {
      if (currentMode === false) {
        // switching not editing to editing
        if (!this.areCommentsHidden) {
          this.set('didHideComments', true);
          this.hideComments();
        }
        return;
      }
      // switching from editing to not editing
      if (this.didHideComments) {
        this.set('didHideComments', false);

        if (this.areCommentsHidden) {
          // only toggle if comments are still hidden
          this.hideComments();
        }
      }
    },
  },
});

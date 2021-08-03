/**
 * Allow users to drop sub folders onto the workspace to move the folder to the top level.
 *
 * Passed in to this component:
 * - folders: The list of folders for the current workspace
 */
import Component from '@ember/component';
import { computed } from '@ember/object';
import { next } from '@ember/runloop';
import Encompass from '../app';
import CurrentUserMixin from '../mixins/current_user_mixin';
import ErrorHandlingMixin from '../mixins/error_handling_mixin';
import './Droppable';

export default Component.extend(
  CurrentUserMixin,
  ErrorHandlingMixin,
  {
    classNames: ['dropTarget'],
    classNameBindings: ['dragAction'],
    folderSaveErrors: [],

    // This will determine which class (if any) you should add to
    // the view when you are in the process of dragging an item.
    dragAction: computed('dragContext', {
      get: function () {
        return null;
      },
      set: function (key, value) {
        return null;
      },
    }),

    drop: function (event) {
      var dataTransfer = event.originalEvent.dataTransfer;
      var dropType = dataTransfer.getData('Text');
      var dropObject = dataTransfer.getData('application/json');
      var comp = this;

      // Set view properties
      // Must be within `Ember.run.next` to always work
      if (dropType === 'folder') {
        next(comp, function () {
          comp.putFolderInWorkspace(dropObject);
        });
      }

      return comp._super(event);
    },

    putFolderInWorkspace: function (folderToAdd) {
      var folderModel = false;
      var parentFolder = false;

      folderToAdd = JSON.parse(folderToAdd);
      folderModel = this.folders
        .filterBy('id', folderToAdd.id)
        .get('firstObject');

      if (!folderModel) {
        console.info("Could not retrieve the folder's model...");
        return;
      }

      parentFolder = folderModel.get('parent');

      // this folder is already at the top level. leave it alone
      if (!parentFolder) {
        return;
      }

      parentFolder.get('children').removeObject(folderModel);
      folderModel.set('parent', null);
      folderModel.set('isTopLevel', true);
      folderModel
        .save()
        .then((res) => {
          // handle success
        })
        .catch((err) => {
          this.handleErrors(err, 'folderSaveErrors', folderModel);
        });
    },
  }
);

'use strict';

/**
 * Allow users to drop sub folders onto the workspace to move the folder to the top level.
 *
 * Passed in to this component:
 * - folders: The list of folders for the current workspace
 */
require('app/components/Droppable');

Encompass.WorkspaceFolderDropComponent = Ember.Component.extend(Encompass.DragNDrop.Droppable, {
  classNames: ['dropTarget'],
  classNameBindings: ['dragAction'],

  // This will determine which class (if any) you should add to
  // the view when you are in the process of dragging an item.
  dragAction: Ember.computed({
    get: function get() {
      return null;
    },
    set: function set(key, value) {
      return null;
    }
  }).property('dragContext'),

  drop: function drop(event) {
    var dataTransfer = event.originalEvent.dataTransfer;
    var dropType = dataTransfer.getData('Text');
    var dropObject = dataTransfer.getData('application/json');
    var comp = this;

    // Set view properties
    // Must be within `Ember.run.next` to always work
    if (dropType === 'folder') {
      Ember.run.next(comp, function () {
        comp.putFolderInWorkspace(dropObject);
      });
    }

    return comp._super(event);
  },

  putFolderInWorkspace: function putFolderInWorkspace(folderToAdd) {
    var folderModel = false;
    var parentFolder = false;

    folderToAdd = JSON.parse(folderToAdd);
    folderModel = this.folders.filterBy('id', folderToAdd.id).get('firstObject');

    if (!folderModel) {
      console.info('Could not retrieve the folder\'s model...');
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
    folderModel.save();
  }
});
//# sourceMappingURL=workspace-folder-drop.js.map

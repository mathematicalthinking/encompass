/**
 * Allow users to drop sub folders onto the workspace to move the folder to the top level.
 *
 * Passed in to this component:
 * - folders: The list of folders for the current workspace
 */
import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class WorkspaceFolderDropComponent extends Component {
  @service errorHandling;

  @tracked dragAction = null;
  @tracked folderSaveErrors = [];

  get folders() {
    return this.args.folders;
  }

  @action
  handleDrop(event) {
    const dataTransfer = event.dataTransfer || event.originalEvent.dataTransfer;
    const dropType = dataTransfer.getData('Text');
    const dropObject = dataTransfer.getData('application/json');

    if (dropType === 'folder') {
      this.putFolderInWorkspace(dropObject);
    }

    event.preventDefault();
  }

  @action
  allowDrop(event) {
    event.preventDefault();
  }

  putFolderInWorkspace(folderToAdd) {
    let folderModel = null;
    const parsed = JSON.parse(folderToAdd);

    folderModel = this.folders.find((f) => f.id === parsed.id);

    if (!folderModel) {
      console.info("Could not retrieve the folder's model...");
      return;
    }

    const parentFolder = folderModel.parent;

    // already top-level
    if (!parentFolder) {
      return;
    }

    parentFolder.get('children')?.removeObject(folderModel);
    folderModel.parent = null;
    folderModel.isTopLevel = true;

    folderModel.save().catch((err) => {
      this.errorHandling.handleErrors(err, 'folderSaveErrors', folderModel);
    });
  }
}

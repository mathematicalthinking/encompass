import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class FolderListComponent extends Component {
  @service currentUser;
  @service('sweet-alert') alert;
  @service errorHandling;
  @service('utility-methods') utils;
  @service('workspace-permissions') permissions;
  @service store;

  @tracked editFolderMode = false;
  @tracked weighting = 1;
  @tracked didHideComments = false;

  get createRecordErrors() {
    return this.errorHandling.getErrors('createRecordErrors');
  }

  get updateRecordErrors() {
    return this.errorHandling.getErrors('updateRecordErrors');
  }

  get canCreate() {
    return this.permissions.canEdit(this.args.workspace, 'folders', 2);
  }

  get canEdit() {
    return this.permissions.canEdit(this.args.workspace, 'folders', 3);
  }

  get canDelete() {
    return this.permissions.canEdit(this.args.workspace, 'folders', 3);
  }

  get canManageFolders() {
    return this.canCreate || this.canEdit || this.canDelete;
  }

  get isBipaneled() {
    return this.args.containerLayoutClass === 'fsh';
  }

  get isTripaneled() {
    return this.args.containerLayoutClass === 'fsc';
  }

  get topLevelFolders() {
    return this.args.folders.filter((folder) => {
      let parentId = this.utils.getBelongsToId(folder, 'parent');
      return this.utils.isNullOrUndefined(parentId);
    });
  }

  get sortedFolders() {
    return [...this.topLevelFolders].sort((a, b) => {
      return a.weight - b.weight || a.name.localeCompare(b.name);
    });
  }

  get toggleDisplayText() {
    return this.args.isHidden ? 'Show Folders' : 'Hide Folders';
  }

  get editFolderText() {
    return this.editFolderMode ? 'Done' : 'Edit';
  }

  get editFolderIcon() {
    return this.editFolderMode ? 'fas fa-check' : 'fas fa-pencil-alt';
  }

  get toggleEditAlt() {
    return this.editFolderMode ? 'Save Changes' : 'Edit Folders';
  }

  siblings(folder, above = true) {
    let parentId = this.utils.getBelongsToId(folder, 'parent');

    let siblings = this.args.folders.filter((f) => {
      return this.utils.getBelongsToId(f, 'parent') === parentId;
    });

    let sortedSiblings = [...siblings].sort((a, b) => {
      return a.weight - b.weight || a.name.localeCompare(b.name);
    });

    let index = sortedSiblings.indexOf(folder);
    return above
      ? sortedSiblings.slice(0, index)
      : sortedSiblings.slice(index + 1);
  }

  @action
  openModal() {
    this.alert
      .showPrompt('text', 'Create New Folder', null, 'Save')
      .then((result) => {
        if (result.value) {
          this.createFolder(result.value);
        }
      });
  }

  @action
  createFolder(folderName) {
    const folder = this.store.createRecord('folder', {
      name: folderName,
      workspace: this.args.workspace,
      weight: 0,
      createdBy: this.currentUser.user,
    });

    folder
      .save()
      .then(() => {
        this.alert.showToast(
          'success',
          `${folderName} created`,
          'bottom-end',
          3000
        );
      })
      .catch((err) => {
        this.errorHandling.handleErrors(err, 'createRecordErrors', folder);
        this.alert.showToast('error', err.errors[0].detail, 'bottom-end', 4000);
        folder.deleteRecord();
      });
  }

  @action
  askToDelete(folder) {
    this.alert
      .showModal(
        'warning',
        `Are you sure you want to delete ${folder.name}`,
        null,
        'Yes, delete it'
      )
      .then((result) => {
        if (result.value) {
          this.confirmDelete(folder);
        }
      });
  }

  @action
  confirmDelete(folder) {
    folder.isTrashed = true;
    folder
      .save()
      .then(() => {
        this.alert.showToast(
          'success',
          `${folder.name} deleted`,
          'bottom-end',
          3000
        );
      })
      .catch((err) => {
        this.alert.showToast('error', err.errors[0].detail, 'bottom-end', 3000);
        this.errorHandling.handleErrors(err, 'updateRecordErrors', folder);
      });
  }

  @action
  fileSelectionInFolder(objId, folder) {
    this.args.fileSelection?.(objId, folder);
  }

  @action
  activateEditFolderMode() {
    this.editFolderMode = true;
  }

  @action
  cancelEditFolderMode() {
    this.editFolderMode = false;
  }

  @action
  toggleEditMode(currentMode) {
    this.hideComments(currentMode);
    this.editFolderMode = !this.editFolderMode;
  }

  @action
  moveOut(folder) {
    const parent = folder.parent;
    const newParent = parent?.parent;

    if (!parent) return;

    parent.children?.removeObject(folder);
    folder.parent = newParent || null;

    folder.save().catch((err) => {
      this.errorHandling.handleErrors(err, 'updateRecordErrors', folder);
    });
  }

  @action
  moveUp(folder) {
    const siblings = this.siblings(folder, true);
    if (!siblings.length) return;

    const min = siblings.at(-1).weight;
    if (folder.weight !== min) {
      [folder.weight, siblings.at(-1).weight] = [min, folder.weight];
      folder.save();
      siblings.at(-1).save();
    } else {
      folder.weight -= this.weighting;
      folder.save();
      siblings.forEach((sib, idx) => {
        if (idx !== 0) {
          sib.weight += this.weighting;
          sib.save();
        }
      });
    }
  }

  @action
  moveDown(folder) {
    const siblings = this.siblings(folder, false);
    if (!siblings.length) return;

    const max = siblings[0].weight;
    if (folder.weight !== max) {
      [folder.weight, siblings[0].weight] = [max, folder.weight];
      folder.save();
      siblings[0].save();
    } else {
      folder.weight += this.weighting;
      folder.save();
      siblings.forEach((sib, idx) => {
        if (idx !== 0) {
          sib.weight += this.weighting;
          sib.save();
        }
      });
    }
  }

  @action
  hideFolders() {
    this.args.hideFolders?.();
  }

  @action
  hideComments(currentMode) {
    if (currentMode === false) {
      // entering edit mode
      if (!this.args.areCommentsHidden) {
        this.didHideComments = true;
        this.args.hideComments?.();
      }
    } else {
      // exiting edit mode
      if (this.didHideComments && this.args.areCommentsHidden) {
        this.didHideComments = false;
        this.args.hideComments?.();
      }
    }
  }
}

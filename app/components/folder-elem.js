import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class FolderElemComponent extends Component {
  @service currentUser;
  @service('sweet-alert') alert;
  @service('utility-methods') utils;
  @service errorHandling;

  @tracked updateRecordErrors = [];
  @tracked queryErrors = [];

  get creatorId() {
    return this.utils.getBelongsToId(this.args.model, 'createdBy');
  }

  get isOwnFolder() {
    return this.currentUser.user.id === this.creatorId;
  }

  get canDeleteFolder() {
    return this.isOwnFolder || this.args.canDeleteFolders;
  }

  get canEditFolder() {
    return this.isOwnFolder || this.args.canEditFolders;
  }

  get containsCurrentSubmission() {
    const submissionId = this.args.currentSubmission?.id;
    const submissions = this.args.model.isExpanded
      ? this.args.model.submissions
      : this.args.model._submissions;
    return submissions?.some((sub) => sub.id === submissionId);
  }

  get containsCurrentSelection() {
    const selectionId = this.args.currentSelection?.id;
    const selections = this.args.model.isExpanded
      ? this.args.model.taggedSelections
      : this.args.model._selections;
    return selections?.some((sel) => sel.id === selectionId);
  }

  get hasManyTaggings() {
    return (this.args.model.childSelections?.length || 0) > 99;
  }

  get selectionsTitle() {
    let selectionsCount = this.args.model.childSelections?.length || 0;
    let submissionsCount = this.args.model.submissions?.length || 0;

    let selectionNoun = selectionsCount === 1 ? 'selection' : 'selections';
    let submissionsNoun = submissionsCount === 1 ? 'submission' : 'submissions';

    return `${selectionsCount} ${selectionNoun} from ${submissionsCount} ${submissionsNoun}`;
  }

  @action
  toggle() {
    this.args.model.isExpanded = !this.args.model.isExpanded;
  }

  @action
  editFolderName() {
    const folder = this.args.model;
    if (folder.hasDirtyAttributes) {
      folder
        .save()
        .then(() => {
          this.alert.showToast('success', 'Folder updated', 'bottom-end');
        })
        .catch((err) => {
          this.errorHandling.handleErrors(err, 'updateRecordErrors', folder);
        });
    }
  }

  @action
  confirmDelete() {
    this.args.confirm?.(this.args.model);
  }

  @action
  openLink() {
    let baseUrl = `${window.location.protocol}//${window.location.host}`;
    window.open(
      `${baseUrl}/#/workspaces/${this.args.currentWorkspace.id}/folders/${this.args.model.id}`,
      'newwindow',
      'width=1000, height=700'
    );
  }

  @action
  updateTaggings() {
    this.args.currentWorkspace.reload();
  }

  @action
  dragStart(event) {
    const dataTransfer = event.dataTransfer;
    dataTransfer.setData(
      'application/json',
      JSON.stringify({ id: this.args.model.id })
    );
    dataTransfer.setData('text/plain', 'folder');
    event.stopPropagation();
  }

  @action
  dragEnter(event) {
    event.preventDefault();
    event.currentTarget.classList.add('drop-target');
  }

  @action
  dragLeave(event) {
    event.preventDefault();
    event.currentTarget.classList.remove('drop-target');
  }

  @action
  drop(event) {
    event.preventDefault();
    event.currentTarget.classList.remove('drop-target');

    const type = event.dataTransfer.getData('text/plain');
    const raw = event.dataTransfer.getData('application/json');
    if (!type || !raw) return;

    const obj = JSON.parse(raw);

    if (type === 'selection') {
      if (this.args.model.hasSelection?.(obj.id)) {
        this.alert.showToast('info', 'Already filed', 'bottom-end');
        return;
      }
      this.putSelectionInFolder(obj.id, this.args.model);
      this.args.dropped?.(obj.id, this.args.model);
    } else if (type === 'folder') {
      this.putFolderInFolder(obj, this.args.model);
    }
  }

  putSelectionInFolder(selectionId, folder) {
    try {
      folder.selections.pushObject?.(selectionId);
      folder.save?.();
      this.alert.showToast('success', 'Selection filed', 'bottom-end');
    } catch (err) {
      this.errorHandling.handleErrors(err, 'updateRecordErrors', folder);
    }
  }

  async putFolderInFolder(child, parent) {
    if (child.id === parent.id) {
      this.alert.showToast(
        'error',
        'Folder cannot be moved into itself',
        'bottom-end'
      );
      return;
    }

    // Prevent dropping into own descendant
    let iter = parent;
    while (iter?.parent) {
      if (iter.parent.id === child.id) {
        this.alert.showToast(
          'error',
          'Cannot drop into a descendant',
          'bottom-end'
        );
        return;
      }
      iter = iter.parent;
    }

    // Get full list of folders if needed (legacy-style)
    let folders = this.args.folderList; // expect preloaded folder list here
    let droppedFolder = folders?.find((f) => f.id === child.id);

    if (!droppedFolder) {
      this.alert.showToast('error', 'Folder not found in list', 'bottom-end');
      return;
    }

    let parentOfDropped = null;
    const oldParent = await droppedFolder.parent;

    if (oldParent && folders) {
      parentOfDropped = folders.find((f) => f.id === oldParent.id);
    }

    if (parentOfDropped) {
      const oldChildren = await parentOfDropped.children;
      oldChildren.removeObject(droppedFolder);
    }

    droppedFolder.parent = parent;

    const newChildren = await parent.children;
    newChildren.pushObject(droppedFolder);

    try {
      await droppedFolder.save();
      this.alert.showToast(
        'success',
        `${droppedFolder.name} is now inside ${parent.name}`,
        'bottom-end'
      );
    } catch (err) {
      this.errorHandling.handleErrors(err, 'updateRecordErrors', droppedFolder);
    }
  }
}

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class DraggableSelectionComponent extends Component {
  @service('sweet-alert') alert;
  @service('utility-methods') utils;
  @service currentUser;

  @tracked isExpanded = false;
  @tracked isDragging = false;

  get modelIdsReady() {
    return (
      this.args.selection &&
      this.args.selection.workspace &&
      this.args.selection.submission
    );
  }

  get selectionModelIds() {
    return [
      this.args.selection.workspace?.id,
      this.args.selection.submission?.id,
      this.args.selection?.id,
    ];
  }

  get workspaceType() {
    return this.args.selection.workspace.get('workspaceType');
  }

  get isParentWorkspace() {
    return this.workspaceType === 'parent';
  }

  get canDelete() {
    const currentUserId = this.currentUser.id;
    const creatorId = this.args.selection.createdBy.id;
    return currentUserId === creatorId || this.args.canDeleteSelections;
  }

  get isImage() {
    const imageTagLink = this.args.selection.imageTagLink;
    return imageTagLink ? imageTagLink.length > 0 : false;
  }

  get linkToClassName() {
    return this.isImage ? 'selection-image' : 'selection_text';
  }

  get isSelected() {
    return this.args.selection?.id === this.args.currentSelection?.id;
  }

  get isVmtClip() {
    const { startTime, endTime } = this.args.selection.vmtInfo || {};
    return startTime >= 0 && endTime >= 0;
  }

  get titleText() {
    if (!this.isVmtClip) {
      const createDate = new Date(
        this.args.selection?.createDate ?? Date.now()
      );
      const formatter = new Intl.DateTimeFormat(undefined, {
        dateStyle: 'short',
        timeStyle: 'short',
      });
      const displayDate = formatter.format(createDate);
      return `Created ${displayDate}`;
    }
    const { startTime, endTime } = this.args.selection.vmtInfo;
    return `${this.utils.getTimeStringFromMs(
      startTime
    )} - ${this.utils.getTimeStringFromMs(endTime)}`;
  }

  get overlayIcon() {
    if (!this.isImage) {
      return '';
    }
    return this.isVmtClip ? 'fas fa-play' : 'fas fa-expand';
  }

  @action
  dragStart(event) {
    const dataTransfer = event.dataTransfer;
    const data = JSON.stringify(this.args.selection);
    const dataWithId = `{"id": "${this.args.selection.id}",${data.substring(
      1
    )}`;
    dataTransfer.setData('application/json', dataWithId);
    dataTransfer.setData('text/plain', 'selection');
    this.isDragging = true;
  }

  @action
  dragEnd() {
    this.isDragging = false;
  }

  @action
  deleteSelection() {
    this.alert
      .showModal(
        'warning',
        'Are you sure you want to delete this selection?',
        null,
        'Yes, delete it'
      )
      .then((result) => {
        if (result.value) {
          this.args.deleteSelection(this.args.selection);
        }
      });
  }

  @action
  expandImage() {
    if (!this.isVmtClip) {
      this.isExpanded = !this.isExpanded;
    }
  }

  // Add the draggable attribute directly
  get draggable() {
    return 'true';
  }

  @action
  setupDrag(event) {
    const dataTransfer = event.dataTransfer;
    dataTransfer.setData('text/plain', this.elementId);
  }
}

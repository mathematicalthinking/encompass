import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

const SELECTION_DATE_FORMATTER = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'short',
  timeStyle: 'short',
});
const SELECTION_TOOLTIP_CACHE = new WeakMap();

function readPath(obj, path) {
  if (!obj || !path) {
    return undefined;
  }

  if (typeof obj.get === 'function') {
    try {
      return obj.get(path);
    } catch (_error) {
      return undefined;
    }
  }

  return path.split('.').reduce((current, segment) => {
    if (current == null) {
      return undefined;
    }
    return current[segment];
  }, obj);
}

export default class DraggableSelectionComponent extends Component {
  @service('sweet-alert') alert;
  @service('utility-methods') utils;
  @service currentUser;
  @service currentSelection;

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
    const creatorId = this.selectionCreatorId;
    const isAdmin = this.currentUser.isAdmin && !this.currentUser.isStudent;
    return (
      currentUserId === creatorId || (isAdmin && this.args.canDeleteSelections)
    );
  }

  get selectionCreatorId() {
    return (
      this.utils.getBelongsToId(this.args.selection, 'createdBy') ||
      readPath(this.args.selection, 'createdBy.id')
    );
  }

  get isOwnSelection() {
    return this.currentUser.id === this.selectionCreatorId;
  }

  get isAdminDeletingOthersSelection() {
    const isAdmin = this.currentUser.isAdmin && !this.currentUser.isStudent;
    return isAdmin && !this.isOwnSelection;
  }

  get isImage() {
    const source = this.imageSource;
    return typeof source === 'string' && source.length > 0;
  }

  get imageSource() {
    return (
      this.args.selection.imageTagLink || this.args.selection.imageSrc || ''
    );
  }

  get linkToClassName() {
    return this.isImage ? 'selection-image' : 'selection_text';
  }

  get isSelected() {
    return this.currentSelection.isCurrentSelection(this.args.selection?.id);
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
      const displayDate = SELECTION_DATE_FORMATTER.format(createDate);
      return `Created ${displayDate}`;
    }
    const { startTime, endTime } = this.args.selection.vmtInfo;
    return `${this.utils.getTimeStringFromMs(
      startTime
    )} - ${this.utils.getTimeStringFromMs(endTime)}`;
  }

  get selectionCreatorName() {
    const selection = this.args.selection;
    if (!selection) {
      return '';
    }

    const directCreator =
      readPath(selection, 'createdBy.username') ||
      readPath(selection, 'originalSelection.createdBy.username');
    if (directCreator) {
      return directCreator;
    }

    return '';
  }

  get selectionTooltip() {
    const selection = this.args.selection;
    if (!selection) {
      return '';
    }

    const cachedTooltip = SELECTION_TOOLTIP_CACHE.get(selection);
    if (cachedTooltip) {
      return cachedTooltip;
    }

    const creatorName = this.selectionCreatorName;
    const tooltip = creatorName
      ? `${this.titleText} by ${creatorName}`
      : `${this.titleText}`;
    SELECTION_TOOLTIP_CACHE.set(selection, tooltip);
    return tooltip;
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
    // Only the id travels with the drag; the drop targets look the record up
    // themselves. Serialising the record itself throws now that ember data
    // models no longer implement toJSON - JSON.stringify walks into the store
    // and hits a circular reference.
    dataTransfer.setData(
      'application/json',
      JSON.stringify({ id: this.args.selection.id })
    );
    dataTransfer.setData('text/plain', 'selection');
    this.isDragging = true;
  }

  @action
  dragEnd() {
    this.isDragging = false;
  }

  @action
  deleteSelection() {
    if (!this.canDelete) {
      this.alert.showToast('error', 'You can only delete your own selections.');
      return;
    }

    const isAdminDeletingOthers = this.isAdminDeletingOthersSelection;
    const title = isAdminDeletingOthers
      ? 'This selection belongs to another user. Delete it anyway?'
      : 'Are you sure you want to delete this selection?';
    const confirmText = isAdminDeletingOthers
      ? 'Yes, delete another user selection'
      : 'Yes, delete it';

    this.alert.showModal('warning', title, null, confirmText).then((result) => {
      if (result.value) {
        this.args.deleteSelection(this.args.selection);
      }
    });
  }

  @action
  expandImage(event) {
    event?.preventDefault?.();
    event?.stopPropagation?.();
    if (!this.isVmtClip) {
      this.isExpanded = !this.isExpanded;
    }
  }
}

import Component from '@glimmer/component';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

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

export default class UndraggableSelectionComponent extends Component {
  @service('utility-methods') utils;
  @service currentSelection;

  @tracked isExpanded = false;

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

  get isImage() {
    const imageTagLink = this.args.selection.imageTagLink;
    return imageTagLink ? imageTagLink.length > 0 : false;
  }

  get isText() {
    return !this.isImage;
  }

  get isVmtClip() {
    const vmtInfo = this.args.selection.vmtInfo || {};
    return vmtInfo.startTime >= 0 && vmtInfo.endTime >= 0;
  }

  get linkToClassName() {
    return this.isImage ? 'selection-image' : 'selection_text';
  }

  get isSelected() {
    return this.currentSelection.isCurrentSelection(this.args.selection?.id);
  }

  get titleText() {
    if (!this.isVmtClip) {
      const createDate = new Date(this.args.selection.createDate);
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

  get parentWorkspaceName() {
    if (!this.isParentWorkspace) {
      return '';
    }

    const selection = this.args.selection;
    if (!selection) {
      return '';
    }

    const directName = readPath(selection, 'originalSelection.workspace.name');
    if (directName) {
      return directName;
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
    const workspaceName = this.parentWorkspaceName;
    let tooltip = `${this.titleText}`;

    if (creatorName) {
      tooltip += ` by ${creatorName}`;
    }
    if (workspaceName) {
      tooltip += ` in ${workspaceName}`;
    }

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
  expandImage() {
    if (!this.isVmtClip) {
      this.isExpanded = !this.isExpanded;
    }
  }
}

import Component from '@glimmer/component';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class UndraggableSelectionComponent extends Component {
  @service('utility-methods') utils;

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
    return this.args.selection?.id === this.args.currentSelection?.id;
  }

  get titleText() {
    if (!this.isVmtClip) {
      const createDate = new Date(this.args.selection.createDate);
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
  expandImage() {
    if (!this.isVmtClip) {
      this.isExpanded = !this.isExpanded;
    }
  }
}

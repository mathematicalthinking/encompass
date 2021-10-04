import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias, equal, not } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import moment from 'moment';
import CurrentUserMixin from '../mixins/current_user_mixin';

export default Component.extend(CurrentUserMixin, {
  utils: service('utility-methods'),

  classNames: ['undraggable-selection'],
  isExpanded: false,

  workspaceType: alias('selection.workspace.workspaceType'),

  isParentWorkspace: equal('workspaceType', 'parent'),

  isImage: computed('selection.imageTagLink', function () {
    return this.get('selection.imageTagLink.length') > 0;
  }),

  isText: not('isImage'),

  isVmtClip: computed('selection.vmtInfo.{startTime,endTime}', function () {
    return (
      this.get('selection.vmtInfo.startTime') >= 0 &&
      this.get('selection.vmtInfo.endTime') >= 0
    );
  }),

  linkToClassName: computed('isImage', function () {
    if (this.isImage) {
      return 'selection-image';
    }
    return 'selection_text';
  }),

  isSelected: computed('selection', 'currentSelection', function () {
    return this.get('selection.id') === this.get('currentSelection.id');
  }),
  titleText: computed(
    'isVmtClip',
    'selection.createDate',
    'isParentWorkspace',
    'selection.originalSelection',
    function () {
      if (!this.isVmtClip) {
        let createDate;
        if (this.isParentWorkspace) {
          createDate = this.get('selection.originalSelection.createDate');
        } else {
          createDate = this.get('selection.createDate');
        }
        let displayDate;
        displayDate = moment(createDate).format('l h:mm');
        return `Created ${displayDate}`;
      }
      let startTime = this.get('selection.vmtInfo.startTime');
      let endTime = this.get('selection.vmtInfo.endTime');

      return `${this.utils.getTimeStringFromMs(startTime)} -
              ${this.utils.getTimeStringFromMs(endTime)}`;
    }
  ),

  overlayIcon: computed('isVmtClip}', 'isImage', function () {
    if (!this.isImage) {
      return '';
    }

    if (this.isVmtClip) {
      return 'fas fa-play';
    }
    return 'fas fa-expand';
  }),

  actions: {
    expandImage() {
      if (this.isVmtClip) {
        return;
      }
      this.set('isExpanded', !this.isExpanded);
    },
  },
});

import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias, equal } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import moment from 'moment';
import Encompass from '../app';
import CurrentUserMixin from '../mixins/current_user_mixin';
import './Draggable';

export default Component.extend(
  Encompass.DragNDrop.Draggable,
  CurrentUserMixin,
  {
    alert: service('sweet-alert'),
    utils: service('utility-methods'),
    isExpanded: false,
    classNames: ['draggable-selection'],
    classNameBindings: ['isSelected:is-selected'],

    workspaceType: alias('selection.workspace.workspaceType'),

    isParentWorkspace: equal('workspaceType', 'parent'),

    dragStart: function (event) {
      this._super(event);
      var dataTransfer = event.originalEvent.dataTransfer;
      // stringify just returns the non-ember properties, so the id isn't included
      var data = JSON.stringify(this.selection);
      var dataWithId =
        '{"id": "' + this.selection.get('id') + '",' + data.substring(1);
      dataTransfer.setData('application/json', dataWithId);
      dataTransfer.setData('text/plain', 'selection');
    },
    dragEnd: function (event) {
      // Let the controller know this view is done dragging
      this.set('selection.isDragging', false);
    },

    canDelete: computed(
      'canDeleteSelections',
      'selection.createdBy.id',
      'currentUser.id',
      function () {
        const currentUserId = this.get('currentUser.id');
        const creatorId = this.get('selection.createdBy.id');
        return currentUserId === creatorId || this.canDeleteSelections;
      }
    ),

    isImage: computed('selection.imageTagLink', function () {
      return this.get('selection.imageTagLink.length') > 0;
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
    isVmtClip: computed('selection.vmtInfo.{startTime,endTime}', function () {
      return (
        this.get('selection.vmtInfo.startTime') >= 0 &&
        this.get('selection.vmtInfo.endTime') >= 0
      );
    }),

    titleText: computed('isVmtClip', 'createDate', function () {
      if (!this.isVmtClip) {
        let createDate = this.get('selection.createDate');

        let displayDate = moment(createDate).format('l h:mm');
        return `Created ${displayDate}`;
      }
      let startTime = this.get('selection.vmtInfo.startTime');
      let endTime = this.get('selection.vmtInfo.endTime');

      return `${this.utils.getTimeStringFromMs(startTime)} -
            ${this.utils.getTimeStringFromMs(endTime)}`;
    }),

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
      deleteSelection(selection) {
        this.alert
          .showModal(
            'warning',
            'Are you sure you want to delete this selection?',
            null,
            'Yes, delete it'
          )
          .then((result) => {
            if (result.value) {
              this.sendAction('deleteSelection', selection);
            }
          });
      },
      expandImage() {
        if (this.isVmtClip) {
          return;
        }
        this.set('isExpanded', !this.isExpanded);
      },
    },
  }
);

import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['vmt-activity-list-item'],

  isExpanded: false,
  areRoomsExpanded: false,

  isSelected: computed('activity._id', 'selectedActivityIds.[]', function () {
    let ids = this.selectedActivityIds || [];
    return ids.includes(this.activity._id);
  }),

  encodedImageUri: computed('activity.image', function () {
    if (!this.activity.image) {
      return '';
    }
    return encodeURI(this.activity.image);
  }),

  expandHideRoomsIcon: computed('areRoomsExpanded', function () {
    if (this.areRoomsExpanded) {
      return {
        className: 'far fa-minus-square',
        title: 'Hide rooms',
      };
    }
    return {
      className: 'far fa-plus-square',
      title: 'Show rooms',
    };
  }),

  actions: {
    expandImage() {
      this.set('isExpanded', !this.isExpanded);
    },

    onSelect() {
      this.onSelect(this.activity);
    },
    onRoomSelect(room) {
      this.onRoomSelect(room);
    },
    toggleRooms() {
      this.toggleProperty('areRoomsExpanded');
    },
  },
});

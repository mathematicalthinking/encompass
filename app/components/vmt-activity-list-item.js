Encompass.VmtActivityListItemComponent = Ember.Component.extend({
  classNames: ['vmt-activity-list-item'],

  isExpanded: false,
  areRoomsExpanded: false,

  isSelected: function() {
    let ids = this.get('selectedActivityIds') || [];
    return ids.includes(this.get('activity.id'));
  }.property('activity.id', 'selectedActivityIds.[]'),

  encodedImageUri: function() {
   if (!this.get('activity.image')) {
     return '';
   }
   return encodeURI(this.get('activity.image'));
  }.property('activity.image'),

  expandHideRoomsIcon: function() {
    if (this.get('areRoomsExpanded')) {
      return {
        className: 'far fa-minus-square',
        title: 'Hide rooms'
      };
    }
    return {
      className: 'far fa-plus-square',
      title: 'Show rooms'
    };
  }.property('areRoomsExpanded'),


  actions: {
    expandImage() {
      this.set('isExpanded', !this.get('isExpanded'));
    },

    onSelect() {
      this.get('onSelect')(this.get('activity'));
    },
    onRoomSelect(room) {
      this.get('onRoomSelect')(room);
    },
    toggleRooms() {
      this.toggleProperty('areRoomsExpanded');
    }
  }

});
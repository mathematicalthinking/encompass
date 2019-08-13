Encompass.VmtRoomListItemComponent = Ember.Component.extend({
  classNames: ['vmt-room-list-item'],

  isExpanded: false,

  isSelected: function() {
    let ids = this.get('selectedRoomIds') || [];
    return ids.includes(this.get('room._id'));
  }.property('selectedRoomIds.[]', 'room._id'),

  encodedImageUri: function() {
    if (!this.get('room.image')) {
      return '';
    }
    return encodeURI(this.get('room.image'));
   }.property('room.image'),

  actions: {
    expandImage() {
      this.set('isExpanded', !this.get('isExpanded'));
    },
    onSelect() {
      this.get('onSelect')(this.get('room'));
    }
  }

});
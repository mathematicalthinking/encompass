Encompass.VmtRoomListItemComponent = Ember.Component.extend({
  classNames: ['vmt-room-list-item'],

  isExpanded: false,

  isSelected: function() {
    let ids = this.get('selectedRoomIds') || [];
    return ids.includes(this.get('room._id'));
  }.property('selectedRoomIds.[]', 'room._id'),

  actions: {
    expandImage() {
      this.set('isExpanded', !this.get('isExpanded'));
    },
    onSelect() {
      this.get('onSelect')(this.get('room'));
    }
  }

});
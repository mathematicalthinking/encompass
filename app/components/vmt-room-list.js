Encompass.VmtRoomListComponent = Ember.Component.extend({
  classNames: ['vmt-room-list'],

  actions: {
    onItemSelect(room) {
      if (this.get('onItemSelect')) {
        this.get('onItemSelect')(room);
     }
    }
  }
});
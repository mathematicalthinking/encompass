Encompass.VmtRoomListComponent = Ember.Component.extend({
  classNames: ['vmt-room-list'],

  classNameBindings: ['isSubList:sub-list'],

  labelText:function() {
    if (this.get('customLabel')) {
      return this.get('customLabel');
    }
    if (this.get('isSubList')) {
      let activityName = this.get('parentActivity.name') || '';

      return `Rooms Belonging to Activity ${activityName}`;
    }
    return 'VMT Rooms';
  }.property('customLabel', 'isSubList', 'parentActivity'),

  actions: {
    onItemSelect(room) {
      if (this.get('onItemSelect')) {
        this.get('onItemSelect')(room);
     }
    }
  }
});
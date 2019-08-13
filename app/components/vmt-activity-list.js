Encompass.VmtActivityListComponent = Ember.Component.extend({
  classNames: ['vmt-activity-list'],

  actions: {
    onActivitySelect(activity) {
      // adds all activity's rooms
      this.get('onItemSelect')(activity);
    },

    onRoomSelect(room) {
      this.get('onSubItemSelect')(room);
    },
  }
});
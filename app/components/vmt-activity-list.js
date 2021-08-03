import Component from '@ember/component';






export default Component.extend({
  classNames: ['vmt-activity-list'],

  actions: {
    onActivitySelect(activity) {
      // adds all activity's rooms
      this.onItemSelect(activity);
    },

    onRoomSelect(room) {
      this.onSubItemSelect(room);
    },
  }
});
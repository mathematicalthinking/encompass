import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['vmt-room-list'],

  classNameBindings: ['isSubList:sub-list'],

  labelText: computed(
    'customLabel',
    'isSubList',
    'parentActivity',
    function () {
      if (this.customLabel) {
        return this.customLabel;
      }
      if (this.isSubList) {
        let activityName = this.get('parentActivity.name') || '';

        return `Rooms Belonging to Activity ${activityName}`;
      }
      return 'VMT Rooms';
    }
  ),

  actions: {
    onItemSelect(room) {
      if (this.onItemSelect) {
        this.onItemSelect(room);
      }
    },
  },
});

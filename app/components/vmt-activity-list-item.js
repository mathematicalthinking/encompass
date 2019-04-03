Encompass.VmtActivityListItemComponent = Ember.Component.extend({
  classNames: ['vmt-activity-list-item'],

  isExpanded: false,

  actions: {
    expandImage: function () {
      this.set('isExpanded', !this.get('isExpanded'));
    },
  }

});
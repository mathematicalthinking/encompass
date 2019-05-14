Encompass.UndraggableSelectionComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  utils: Ember.inject.service('utility-methods'),

  classNames: ['undraggable-selection'],
  isExpanded: false,

  isImage: function() {
    return this.get('selection.imageTagLink.length') > 0;
  }.property('selection.imageTagLink'),

  linkToClassName: function() {
    if (this.get('isImage')) {
      return 'selection-image';
    }
    return 'selection_text';
  }.property('isImage'),

  isSelected: function() {
    return this.get('selection.id') === this.get('currentSelection.id');
  }.property('selection', 'currentSelection'),
  titleText: function() {
    let startTime = this.get('selection.vmtInfo.startTime');
    let endTime = this.get('selection.vmtInfo.endTime');

    if (startTime && endTime) {
      return `${this.get('utils').getTimeStringFromMs(startTime)} - ${this.get('utils').getTimeStringFromMs(endTime)}`;
    }
    let createDate = this.get('selection.createDate');

    let displayDate = moment(createDate).format('l h:mm');
    return `Created ${displayDate}`;
  }.property('selection.vmtInfo.{startTime,endTime}', 'createDate'),

  actions: {
    expandImage() {
      this.set('isExpanded', !this.get('isExpanded'));
    }
  }
});

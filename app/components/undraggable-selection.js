Encompass.UndraggableSelectionComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
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

  actions: {
    expandImage() {
      this.set('isExpanded', !this.get('isExpanded'));
    }
  }
});

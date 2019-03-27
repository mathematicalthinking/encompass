require('app/components/Draggable');

Encompass.DraggableSelectionComponent = Ember.Component.extend(Encompass.DragNDrop.Draggable, Encompass.CurrentUserMixin, {
  alert: Ember.inject.service('sweet-alert'),
  isExpanded: false,

  dragStart: function(event) {
    this._super(event);
    var dataTransfer = event.originalEvent.dataTransfer;
    // stringify just returns the non-ember properties, so the id isn't included
    var data = JSON.stringify(this.selection);
    var dataWithId = '{"id": "' + this.selection.get('id') + '",' +  data.substring(1);
    dataTransfer.setData('application/json', dataWithId );
    dataTransfer.setData('text/plain', 'selection');

  },
  dragEnd: function(event) {
    // Let the controller know this view is done dragging
    this.set('selection.isDragging', false);
  },

  canDelete: function() {
    const currentUserId = this.get('currentUser.id');
    const creatorId = this.get('selection.createdBy.id');
    return currentUserId === creatorId || this.get('canDeleteSelections');
  }.property('canDeleteSelections', 'selection.createdBy.id', 'currentUser.id'),

  isImage: function() {
    return this.get('selection.imageTagLink.length') > 0;
  }.property('selection.imageTagLink'),

  linkToClassName: function() {
    if (this.get('isImage')) {
      return 'selection-image';
    }
    return 'selection_text';
  }.property('isImage'),

  actions: {
    deleteSelection(selection) {
      this.get('alert').showModal('warning', 'Are you sure you want to delete this selection?', null, 'Yes, delete it')
      .then((result) => {
        if (result.value) {
          this.sendAction( 'deleteSelection', selection );
        }
      });
    },
    expandImage() {
      this.set('isExpanded', !this.get('isExpanded'));
    }
  }
});

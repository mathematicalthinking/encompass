require('app/components/Draggable');

Encompass.DraggableSelectionComponent = Ember.Component.extend(Encompass.DragNDrop.Draggable, Encompass.CurrentUserMixin, {
  alert: Ember.inject.service('sweet-alert'),
  utils: Ember.inject.service('utility-methods'),
  isExpanded: false,
  classNames: ['draggable-selection'],
  classNameBindings:['isSelected:is-selected'],

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

  isSelected: function() {
    return this.get('selection.id') === this.get('currentSelection.id');
  }.property('selection', 'currentSelection'),
  isVmtClip: function() {
    return this.get('selection.vmtInfo.startTime') >= 0 &&
    this.get('selection.vmtInfo.endTime') >= 0;
  }.property('selection.vmtInfo.{startTime,endTime}'),


  titleText: function() {
    if (!this.get('isVmtClip')) {
      let createDate = this.get('selection.createDate');

      let displayDate = moment(createDate).format('l h:mm');
      return `Created ${displayDate}`;
    }
    let startTime = this.get('selection.vmtInfo.startTime');
    let endTime = this.get('selection.vmtInfo.endTime');

    return `${this.get('utils').getTimeStringFromMs(startTime)} -
            ${this.get('utils').getTimeStringFromMs(endTime)}`;
  }.property('isVmtClip', 'createDate'),

  overlayIcon: function() {
    if (!this.get('isImage')) {
      return '';
    }

    if (this.get('isVmtClip')) {
      return 'fas fa-play';
    }
    return 'fas fa-expand';
  }.property('isVmtClip}', 'isImage'),

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
      if (this.get('isVmtClip')) {
        return;
      }
      this.set('isExpanded', !this.get('isExpanded'));
    }
  }
});

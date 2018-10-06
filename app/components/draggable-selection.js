require('app/components/Draggable');

Encompass.DraggableSelectionComponent = Ember.Component.extend(Encompass.DragNDrop.Draggable, {
  dragStart: function(event) {
    this._super(event);
    var dataTransfer = event.originalEvent.dataTransfer;
    console.log("get 1");
    // stringify just returns the non-ember properties, so the id isn't included
    var data = JSON.stringify(this.selection);
    var dataWithId = '{"id": "' + this.selection.get('id') + '",' +  data.substring(1);
    dataTransfer.setData('application/json', dataWithId );
    dataTransfer.setData('text/plain', 'selection');
    console.log("get 2");

    /*
    controller.get('model').get('selections').forEach(function(selection) {
       console.log("get selection id 1");
      if (selection.get('id') === selectionId) {
        selection = JSON.parse(JSON.stringify(selection));
        selection.id = selectionId;
        selection.workspace = controller.get('currentWorkspace.id'); //this might not be necessary
        dataTransfer.setData('application/json', JSON.stringify(selection));
        return;
      }
    });
    */
    //controller.set('makingSelection', false); ENC-452
    //controller.transitionToRoute('workspace.submission.selection', controller.get('currentSelection')); ENC-461
  },
  dragEnd: function(event) {
    // Let the controller know this view is done dragging
    this.set('selection.isDragging', false);
  },

  actions: {
    deleteSelection: function( selection ){
      console.log("draggable-selection sending DELETE action up...");
      this.sendAction( 'deleteSelection', selection );
    }
  }
});

require('app/components/DragNDrop');

Encompass.DragNDrop.Droppable = Ember.Mixin.create({
  dragEnter: Encompass.DragNDrop.cancel,
  dragOver: Encompass.DragNDrop.cancel,
  drop: function(event) {
    event.preventDefault();
    return false;
  }
});

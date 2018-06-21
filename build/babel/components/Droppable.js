'use strict';

require('app/components/DragNDrop');

Encompass.DragNDrop.Droppable = Ember.Mixin.create({
  dragEnter: Encompass.DragNDrop.cancel,
  dragOver: Encompass.DragNDrop.cancel,
  drop: function drop(event) {
    event.preventDefault();
    return false;
  }
});
//# sourceMappingURL=Droppable.js.map

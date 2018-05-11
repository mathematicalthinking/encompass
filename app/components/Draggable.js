require('app/components/DragNDrop');

Encompass.DragNDrop.Draggable = Ember.Mixin.create({
  attributeBindings: 'draggable',
  draggable: 'true',
  dragStart: function(event) {
    var dataTransfer = event.originalEvent.dataTransfer;
    dataTransfer.setData('text/plain', this.get('elementId'));
  }
});

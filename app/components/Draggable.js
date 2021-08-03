import Mixin from '@ember/object/mixin';
import Encompass from '../app';
import './DragNDrop';






Encompass.DragNDrop.Draggable = Mixin.create({
  attributeBindings: 'draggable',
  draggable: 'true',
  dragStart: function (event) {
    var dataTransfer = event.originalEvent.dataTransfer;
    dataTransfer.setData('text/plain', this.elementId);
  }
});

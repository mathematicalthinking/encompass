import Mixin from '@ember/object/mixin';
import Encompass from '../app';
import './DragNDrop';






export default Encompass.DragNDrop.Droppable = Mixin.create({
  dragEnter: Encompass.DragNDrop.cancel,
  dragOver: Encompass.DragNDrop.cancel,
  drop: function (event) {
    event.preventDefault();
    return false;
  }
});

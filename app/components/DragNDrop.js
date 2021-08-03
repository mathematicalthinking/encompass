import Namespace from '@ember/application/namespace';
import Encompass from '../app';

Encompass.DragNDrop = Namespace.create();

Encompass.DragNDrop.cancel = function (event) {
  event.preventDefault();
  return false;
};

export default Encompass.DragNDrop;

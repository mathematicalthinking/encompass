Encompass.DragNDrop = Ember.Namespace.create();

Encompass.DragNDrop.cancel = function(event) {
  event.preventDefault();
  return false;
};

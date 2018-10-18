Encompass.FilterSelectizeComponent = Ember.Component.extend({
  classNames: ['filter-selectize'],

didReceiveAttrs() {
  let modelName = this.get('modelName');

  if (selectedAttribute) {
    let label = `Filter ${modelName}s by`
    this.set('selectLabel', label);
  }
  this._super(...arguments);
}

});
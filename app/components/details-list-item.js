Encompass.DetailsListItemComponent = Ember.Component.extend({
  classNames: ['details-list-item'],
  utils: Ember.inject.service('utility-methods'),

doShowRemoveIcon: function() {
  if (this.get('cannotBeRemoved')) {
    return false;
  }
  const val = this.get('displayValue');

  return !this.get('utils').isNullOrUndefined(val);
}.property('cannotBeRemoved', 'displayValue'),

actions: {
  editValue() {
    this.get('editValue')(this.get('associatedStep'));
  }

}

});
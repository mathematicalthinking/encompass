Encompass.DetailsListItemComponent = Ember.Component.extend({
  classNames: ['details-list-item'],
  utils: Ember.inject.service('utility-methods'),

  doShowRemoveIcon: function() {
    if (this.get('cannotBeRemoved')) {
      return false;
    }
    const val = this.get('displayValue');
    const children = this.get('children');

    if (children) {
      children.map((child) => {
        let val = child.displayValue;
        if (!this.get('utils').isNullOrUndefined(val)) {
          this.set('hasValidChild', true);
        }
      });
    }

    return !this.get('utils').isNullOrUndefined(val) || this.get('hasValidChild');
  }.property('cannotBeRemoved', 'displayValue'),

  actions: {
    editValue() {
      this.get('editValue')(this.get('associatedStep'));
    },
  }
});
import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: ['details-list-item'],
  utils: service('utility-methods'),

  doShowRemoveIcon: computed('cannotBeRemoved', 'displayValue', function () {
    if (this.cannotBeRemoved) {
      return false;
    }
    const val = this.displayValue;
    const children = this.children;

    if (children) {
      children.map((child) => {
        let val = child.displayValue;
        if (!this.utils.isNullOrUndefined(val)) {
          this.set('hasValidChild', true);
        }
      });
    }

    return !this.utils.isNullOrUndefined(val) || this.hasValidChild;
  }),

  actions: {
    editValue() {
      this.editValue(this.associatedStep);
    },
  },
});

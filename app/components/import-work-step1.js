import Component from '@ember/component';
import { computed } from '@ember/object';
/*global _:false */
import { inject as service } from '@ember/service';
import CurrentUserMixin from '../mixins/current_user_mixin';

export default Component.extend(CurrentUserMixin, {
  elementId: 'import-work-step1',
  utils: service('utility-methods'),

  initialProblemItem: computed('selectedProblem', function () {
    const selectedProblem = this.selectedProblem;
    if (this.utils.isNonEmptyObject(selectedProblem)) {
      return [selectedProblem.id];
    }
    return [];
  }),

  actions: {
    setSelectedProblem(val, $item) {
      if (!val) {
        return;
      }

      const isRemoval = _.isNull($item);
      if (isRemoval) {
        this.set('selectedProblem', null);
        return;
      }

      const problem = this.store.peekRecord('problem', val);
      if (this.utils.isNullOrUndefined(problem)) {
        return;
      }

      this.set('selectedProblem', problem);
      if (this.missingProblem) {
        this.set('missingProblem', null);
      }
    },
    next() {
      const problem = this.selectedProblem;

      // workspace is required to go to next step
      if (this.utils.isNonEmptyObject(problem)) {
        this.onProceed();
        return;
      }
      this.set('missingProblem', true);
    },
  },
});

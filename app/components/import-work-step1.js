import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class ImportWorkStep1Component extends Component {
  @service('utility-methods') utils;
  @service store;

  @tracked selectedProblem = null;
  @tracked missingProblem = null;

  constructor() {
    super(...arguments);
    this.selectedProblem = this.args.selectedProblem || null;
  }

  get initialProblemItem() {
    const selectedProblem = this.args.selectedProblem;
    if (this.utils.isNonEmptyObject(selectedProblem)) {
      return [selectedProblem.id];
    }
    return [];
  }

  @action
  setSelectedProblem(value, item) {
    if (!value) {
      return;
    }

    const isRemoval = this.utils.isNullOrUndefined(item);
    if (isRemoval) {
      this.selectedProblem = null;
      return;
    }

    const problem = this.store.peekRecord('problem', value);
    if (this.utils.isNullOrUndefined(problem)) {
      return;
    }

    this.selectedProblem = problem;
    if (this.missingProblem) {
      this.missingProblem = null;
    }
  }

  @action
  resetMissingProblem() {
    this.missingProblem = null;
  }

  @action
  next() {
    const problem = this.selectedProblem;

    if (this.utils.isNonEmptyObject(problem)) {
      if (typeof this.args.onProceed === 'function') {
        this.args.onProceed(problem);
      }
      return;
    }
    this.missingProblem = true;
  }
}

import ErrorHandlingComponent from './error-handling';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { later } from '@ember/runloop';
import { inject as service } from '@ember/service';
import $ from 'jquery';

export default class AssignmentInfoStudentComponent extends ErrorHandlingComponent {
  @service('utility-methods') utils;
  @service store;
  @tracked isResponding = false;
  @tracked isRevising = false;
  @tracked displayedAnswer = null;
  @tracked loadAnswerErrors = [];

  constructor() {
    super(...arguments);
    let assignment = this.args.assignment;

    if (assignment) {
      if (this.displayedAnswer) {
        this.displayedAnswer = null;
      }

      this.toggleResponse();
    }
  }

  get workspacesToUpdateIds() {
    return this.utils.getHasManyIds(this.args.assignment, 'linkedWorkspaces');
  }

  get isComposing() {
    return this.isRevising || this.isResponding;
  }

  get showReviseButton() {
    return !this.isComposing && this.sortedList.length > 0;
  }

  get showRespondButton() {
    return !this.isComposing && this.sortedList.length === 0;
  }

  get sortedList() {
    if (!this.args.answerList) {
      return [];
    }
    return this.args.answerList.sortBy('createDate').reverse();
  }

  get priorAnswer() {
    return this.sortedList.get('firstObject');
  }

  toggleResponse() {
    if (this.isResponding) {
      this.isResponding = false;
    } else if (this.isRevising) {
      this.isRevising = false;
    }
  }

  @action beginAssignmentResponse() {
    this.isResponding = true;
    later(() => {
      $('html, body').animate({ scrollTop: $(document).height() });
    }, 100);
  }

  @action reviseAssignmentResponse() {
    this.isRevising = true;

    later(() => {
      $('html, body').animate({ scrollTop: $(document).height() });
    }, 100);
  }

  @action displayAnswer(answer) {
    this.displayedAnswer = answer;
    later(() => {
      $('html, body').animate({ scrollTop: $(document).height() });
    }, 100);
  }

  @action handleCreatedAnswer(answer) {
    this.toggleResponse();
    this.args.answerList.addObject(answer);
  }

  @action cancelResponse() {
    this.toggleResponse();
  }
}

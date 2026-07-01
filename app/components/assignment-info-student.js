import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class AssignmentInfoStudentComponent extends Component {
  @service('utility-methods') utils;
  @service store;
  @service scroll;
  @tracked isResponding = false;
  @tracked isRevising = false;
  @tracked displayedAnswer = null;

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
    return this.sortedList[0];
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
    this.scroll.toBottomAfterRender();
  }

  @action reviseAssignmentResponse() {
    this.isRevising = true;
    this.scroll.toBottomAfterRender();
  }

  @action displayAnswer(answer) {
    this.displayedAnswer = answer;
    this.scroll.toBottomAfterRender();
  }

  @action hideAnswer() {
    this.displayedAnswer = null;
  }

  // Reset transient view state when navigating to a different assignment so the
  // previous assignment's open answer / compose form doesn't linger.
  @action handleAssignmentChange() {
    this.displayedAnswer = null;
    this.isRevising = false;
    this.isResponding = false;
  }

  @action handleCreatedAnswer(answer) {
    this.toggleResponse();
    this.args.onAnswerCreated?.(answer);
  }

  @action cancelResponse() {
    this.toggleResponse();
  }
}

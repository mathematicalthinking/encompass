import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
export default class ResponseMentorThreadComponent extends Component {
  // to have responses be collapsed at first
  @tracked show = false;

  // action to toggle the showResponses property
  get showResponsesText() {
    return this.showResponses ? 'Hide responses' : 'Show responses';
  }
  get showResponses() {
    return this.show || this.args.isCreating;
  }
  get showButton() {
    return !this.args.isCreating;
  }
  @action
  toggleShowResponses() {
    this.show = !this.show;
  }
}

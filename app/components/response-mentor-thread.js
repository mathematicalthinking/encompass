import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
export default class ResponseMentorThreadComponent extends Component {
  // to have responses be collapsed at first
  @tracked showResponses = false;

  // action to toggle the showResponses property
  @action
  toggleShowResponses() {
    this.showResponses = !this.showResponses;
  }
}

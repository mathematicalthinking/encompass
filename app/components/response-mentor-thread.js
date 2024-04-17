/**
 * #
 * @description 
  Class component file to response-mentor-thread component. Purpose is to show responses for a mentor thread.
 * @author Yousof Wakili
 * @since 3.6.2
 */

import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ResponseMentorThreadComponent extends Component {
  @tracked show = true;

  get showResponsesText() {
    return this.showResponses
      ? 'Hide responses for this thread'
      : 'Show responses for this thread';
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

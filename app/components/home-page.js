/**
 * # HomePageComponent
 * @description This is the dashboard dispaly component. It takes item (obj {label: string, details: obj[] }), tableColumns (array of objects) as arguments. This class needs to exist in order for Ember Table to work.
 * @author Tim Leonard <tleonard@21pstem.org>
 * @since 3.2.0
 */

import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class HomePageComponent extends Component {
  @service router;
  @service('utility-methods') utils;
  @action toResponse(thread) {
    let response = thread.get('highestPriorityResponse');
    if (response) {
      let responseId = response.get('id');
      let submissionId = this.utils.getBelongsToId(response, 'submission');
      this.router.transitionTo('responses.submission', submissionId, {
        queryParams: { responseId },
      });
    } else {
      let submission = thread.get('highestPrioritySubmission');
      this.router.transitionTo('responses.submission', submission);
    }
  }
}

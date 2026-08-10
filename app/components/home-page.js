/**
 * # HomePageComponent
 * @description This is the dashboard dispaly component. It takes item (obj {label: string, details: obj[] }), tableColumns (array of objects) as arguments. This class needs to exist in order for Ember Table to work.
 * @author Tim Leonard <tleonard@21pstem.org>
 * @since 3.2.0
 */

import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class HomePageComponent extends Component {
  @service router;
  @service('utility-methods') utils;

  // Ember Table writes the active sorts back here via @onUpdateSorts; it must be
  // tracked so column sorting actually re-renders.
  @tracked sorts = [];

  @action
  updateSorts(sorts) {
    this.sorts = sorts;
  }

  @action
  toResponse(thread) {
    const response = thread.highestPriorityResponse;
    if (response) {
      const responseId = response.id;
      const submissionId = this.utils.getBelongsToId(response, 'submission');
      this.router.transitionTo('responses.submission', submissionId, {
        queryParams: { responseId },
      });
    } else {
      const submission = thread.highestPrioritySubmission;
      this.router.transitionTo('responses.submission', submission);
    }
  }
}

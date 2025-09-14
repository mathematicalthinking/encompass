import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { schedule } from '@ember/runloop';
import { action } from '@ember/object';

export default class WorkspaceSubmissionsSubmissionSelectionsSelectionRoute extends Route {
  @service store;
  @service currentUser;
  @service workspaceState;

  queryParams = {
    highlightCommentId: {
      refreshModel: false,
    },
  };

  async model({ selection_id }, transition) {
    const highlightCommentId = transition.to?.queryParams?.highlightCommentId;
    if (highlightCommentId) {
      console.debug(`Highlighting comment with ID: ${highlightCommentId}`);
    }

    return this.store.findRecord('selection', selection_id);
  }

  afterModel(model) {
    this.workspaceState.currentSelection = model;
  }

  deactivate() {
    this.workspaceState.currentSelection = null;
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    const params = this.paramsFor(this.routeName);
    controller.highlightCommentId = params.highlightCommentId;
  }

  renderTemplate() {
    this.render();

    schedule('afterRender', () => {
      const textarea = document.getElementById('commentTextarea');
      if (textarea) {
        textarea.focus();
      }

      const user = this.currentUser.user;

      if (!user.seenTour) {
        if (window.guiders) {
          window.guiders.hideAll();
          // window.guiders.show('comments');
        }
      }
    });
  }

  @action
  willTransition() {
    // Optional cleanup logic
  }
}

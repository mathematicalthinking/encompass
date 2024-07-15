import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';
import $ from 'jquery';

export default class MyRoute extends Route {
  @service workspaceController;
  @service encompass;

  async afterModel(model, transition) {
    this.workspaceController.set('currentSelection', model);
  }

  deactivate() {
    this.workspaceController.set('currentSelection', null);
  }

  get shouldDoTour() {
    let user = this.modelFor('application');
    let userSeenTour = user.seenTour;
    let redoTour = this.encompass?.redoTour;
    return userSeenTour || redoTour;
  }

  get doTourObserver() {
    let user = this.modelFor('application');
    if (!user.seenTour) {
      scheduleOnce('afterRender', this, this.doTour);
    }
  }

  doTour() {
    // Customize for this part of the tour
    window.guiders.hideAll();
    // guiders.show('comments');
  }

  focusOnCommentTextarea() {
    let commentTextarea = document.querySelector('#commentTextarea');
    if (commentTextarea) {
      commentTextarea.focus();
    }
  }

  renderTemplate() {
    this.render();

    // Focus on an element after rendering the template
    scheduleOnce('afterRender', this, this.focusOnCommentTextarea);

    // Uncomment the following section if you want to trigger the tour conditionally
    /*
    let user = this.modelFor('application');
    if (!user.seenTour) {
      this.doTour();
    }
    */
  }
}

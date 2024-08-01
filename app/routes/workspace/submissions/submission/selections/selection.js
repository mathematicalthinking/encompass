import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { tracked } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import $ from 'jquery';

export default class SelectionRoute extends Route {
  @service('workspace') workspaceController;
  @service('application') applicationController;

  afterModel(model) {
    this.workspaceController.set('currentSelection', model);
  }

  deactivate() {
    this.workspaceController.set('currentSelection', null);
  }

  @tracked('applicationController.model.seenTour', 'Encompass.redoTour')
  get shouldDoTour() {
    let user = this.applicationController.model;
    let userSeenTour = user.get('seenTour');
    let redoTour = this.Encompass.redoTour;
    return userSeenTour || redoTour;
  }

  // doTour = observer('shouldDoTour', function () {
  //   let user = this.applicationController.model;

  //   scheduleOnce('afterRender', this, function () {
  //     if (!user.get('seenTour')) {
  //       window.guiders.hideAll();
  //       // guiders.show('comments');
  //     }
  //   });
  // });

  // renderTemplate() {
  //   super.renderTemplate();
  //   $('#commentTextarea').focus();
  //   // Uncomment to trigger tour based on conditions
  //   // if (!this.applicationController.model.get('seenTour')) {
  //   //   this.doTour();
  //   // }
  // }
}

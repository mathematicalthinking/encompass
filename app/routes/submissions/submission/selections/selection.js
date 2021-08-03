import { computed } from '@ember/object';
import Route from '@ember/routing/route';
import { schedule } from '@ember/runloop';
import $ from 'jquery';

export default Route.extend({
  afterModel: function (model, transition) {
    this.controllerFor('workspace').set('currentSelection', model);
  },

  deactivate: function () {
    this.controllerFor('workspace').set('currentSelection', null);
  },

  doTour: observer('shouldDoTour', function () {
    var user = this.modelFor('application');

    schedule('afterRender', function () {
      if (!user.get('seenTour')) {
        //customize for this part of the tour
        window.guiders.hideAll();
        //guiders.show('comments');
      }
    });
  }),

  shouldDoTour: computed('Encompass.redoTour', function () {
    var user = this.modelFor('application');
    var userSeenTour = user.get('seenTour');
    var redoTour = this.get('Encompass.redoTour');
    return userSeenTour || redoTour;
  }),

  renderTemplate: function () {
    this.render();
    $('#commentTextarea').focus();
    // var user = this.modelFor('application');
    //    if (!user.get('seenTour')) {
    //      this.doTour();
    //    }
  },
});

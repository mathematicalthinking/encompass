'use strict';

Encompass.ResponsesNewSubmissionRoute = Ember.Route.extend(Encompass.ConfirmLeavingRoute, {

  controllerName: 'response',

  renderTemplate: function renderTemplate(controller, model) {
    controller.set('model', model);
    controller.set('editing', false);
    this.render('response');
  },

  afterModel: function afterModel(model) {
    console.log(model);
  },

  model: function model(params) {
    var route = this;
    // jshint camelcase: false
    var submission = this.store.find('submission', params.submission_id);

    var promise = new Ember.RSVP.Promise(function (resolve, reject) {
      submission.then(function (sub) {
        var workspaces = sub.get('workspaces');
        var selections = sub.get('selections');
        var comments = sub.get('comments');
        workspaces.then(function (w) {
          selections.then(function (s) {
            comments.then(function (c) {
              var response = route.get('store').createRecord('response', {
                source: 'submission',
                submission: sub,
                workspace: w.get('firstObject') //hmmm
              });
              response.get('selections').then(function (selections) {
                selections.pushObjects(s.filterBy('isTrashed', false));
                response.get('comments').then(function (comments) {
                  comments.pushObjects(c.filterBy('isTrashed', false));
                  resolve(response);
                });
              });
            });
          });
        });
      });
    });
    return promise;
  }

});
//# sourceMappingURL=responses_new_submission_route.js.map

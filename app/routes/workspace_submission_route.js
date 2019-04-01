/**
  * # Workspace Submission Route
  * @description This route renders the templates for working on a submission in a workspace
    model: a single submission (the current submission)
  * @author Damola Mabogunje <damola@mathforum.org>, Amir Tahvildaran <amir@mathforum.org>
  * @since 1.0.1
  * @see workspace_submissions_route
  */
/*global _:false */
Encompass.WorkspaceSubmissionRoute = Ember.Route.extend(Encompass.CurrentUserMixin, {
  alert: Ember.inject.service('sweet-alert'),

  model(params) {
    let submissions = this.modelFor('workspace.submissions');
    let submission = submissions.findBy('id', params.submission_id);

    if (submission.get('vmtRoomId')) {
      window.vmtRoomId = submission.get('vmtRoomId');
    }
    return submission;
  },

  setupController: function(controller, model) {
    this._super(controller, model);
  },

  activate: function() {
    this.controllerFor('application').set('isSmallHeader', true);
  },

  deactivate: function() {
    this.controllerFor('application').set('isSmallHeader', false);
  },

  renderTemplate: function(controller, model) {
    this.render();

    let user = this.modelFor('application');

    Ember.run.schedule('afterRender', () => {
      if(!user.get('seenTour')) {
        this.controller.send('startTour', 'workspace');
      }
    });
  },

  actions: {
    reload: function() {
      this.refresh();
    },

    addSelection: function( selection ){
    },

    tagSelection: function(selection, tags){
      var route = this;
      var workspace = this.modelFor('workspace');
      workspace.get('folders').then(function(folders){
        var lcFolders = {};
        folders.forEach(function(f){
          lcFolders[f.get('name').toLowerCase().replace(/\s+/g, '')] = f;
        });
        tags.forEach(function(tag){
          if(_.keys(lcFolders).includes(tag)) {
            route.send('fileSelectionInFolder', selection.get('id'), lcFolders[tag]);
          }
        });
      });
    },
    fileSelectionInFolder: function(selectionId, folder){
      let selection = this.get('store').peekRecord('selection', selectionId);
      let workspace = this.modelFor('workspace');

      if (!selection) {
        return;
      }
      let tagging = this.get('store').createRecord('tagging', {
        workspace,
        selection,
        folder,
        createdBy: this.get('currentUser')
      });
      tagging.save()
        .then((savedTagging) => {
          this.get('alert').showToast('success', 'Selection Filed', 'bottom-end', 3000, false, null);
        })
        .catch((err) => {
          console.log('err save tagging', err);
        });
    }
  }
});

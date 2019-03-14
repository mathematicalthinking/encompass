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

  model(params) {
    let submissions = this.modelFor('workspace.submissions');
    return submissions.findBy('id', params.submission_id);
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
      var store = this.get('store');
      var currentUser = this.get('currentUser');

      // find folder from store to ensure data is updated

      store.findRecord('folder', folder.get('id')).then((folder) => {
        folder.get('workspace')
        .then(function(workspace) {
          workspace.get('selections')
            .then(function(selections) {
              var selection = selections.filterBy('id', selectionId).get('firstObject');
              var tagging = store.createRecord('tagging', {
                workspace: workspace,
                folder: folder,
                selection: selection,
                createdBy: currentUser,
              });

              tagging.save().then(function(obj) {
                selection.get('taggings').then(function(taggings){
                  taggings.pushObject(tagging);
                });
                folder.get('taggings').then(function(taggings){
                  taggings.pushObject(tagging);
                });
              });
            });
        });
      });


    }
  }
});

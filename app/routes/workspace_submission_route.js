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

  /*
  model: function(params){
    console.log("W-S Route model hook for: " + params.submission_id );
    this.get('store').findRecord('submission', params.submission_id );
  },
  */

  setupController: function(controller, model) {
    console.log("W-S Route!");
    this._super(controller, model);
    var currentWs = controller.get('currentWorkspace');
    currentWs.set('owner', currentWs.get('owner'));
  },

  afterModel: function( model, transition ){
    console.log("W-s After Model!");
  },

  activate: function() {
    this.controllerFor('application').set('isSmallHeader', true);
  },

  deactivate: function() {
    this.controllerFor('application').set('isSmallHeader', false);
  },

  renderTemplate: function(controller, model) {
    console.log("Rendering template for W-S");
    var route = this;

    var foldersController = route.controllerFor('folders');
    // var commentsController = route.controllerFor('comments');
    // var workspaceController = route.controllerFor('workspace.submissions');

    var workspace = this.modelFor('workspace');
    foldersController.set('model', workspace.get('folders'));

    route.render();

    /*
    this.render('folders', {
      into: 'workspace.submission',
      outlet: 'folders',
      controller: foldersController
    });
    */

    /*
    this.render('submissions', {
      into: 'workspace.submission',
      outlet: 'submissions',
      controller: workspaceController
    });
    */

      /*
    this.render('comments', {
      into: 'workspace.submission',
      outlet: 'comments'
    });
    */


    /*
    route.render('submission', {
      into: 'submissions',
      outlet: 'submission'
    });
    */

    var user = this.modelFor('application');

    Ember.run.schedule('afterRender', function() {
      if(!user.get('seenTour')) {
        //user.set('seenTour', new Date());
        //user.save();
        console.info('starting the tour!');
        route.send('startTour', 'workspace');
      }
    });
  },

  actions: {
    reload: function() {
      this.refresh();
    },

    addSelection: function( selection ){
      console.log("W-S Route: Got add selection action!");
    },

    tagSelection: function(selection, tags){
      var route = this;
      console.log('tagging selection: ' + selection);
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
      console.log('tagging selection: ' + selectionId);
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
                console.debug('saved tag: ' + obj.get('id'));
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

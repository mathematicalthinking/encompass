/**
  * # Workspace Submission Route
  * @description This route renders the templates for working on a submission in a workspace
    model: a single submission (the current submission)
  * @author Damola Mabogunje <damola@mathforum.org>, Amir Tahvildaran <amir@mathforum.org>
  * @since 1.0.1
  * @see workspace_submissions_route
  */
/*global _:false */
Encompass.WorkspaceSubmissionRoute = Ember.Route.extend(Encompass.CurrentUserMixin, Encompass.VmtHostMixin, {
  alert: Ember.inject.service('sweet-alert'),
  utils: Ember.inject.service('utility-methods'),

  queryParams: 'vmtRoomId',

  model(params) {

    let { submission_id} = params;

    let submissions = this.modelFor('workspace.submissions');
    return submissions.findBy('id', submission_id);
  },

  afterModel(submission, transition) {

    return this.resolveVmtRoom(submission)
    .then((room) => {
      if (!room) {
        return;
      }
      let vmtRoomId = room._id;

      // so links to selections still work
      if (transition.intent.name === 'workspace.submission') {
        this.transitionTo('workspace.submission', submission, {queryParams: {vmtRoomId}});
      }
    });
  },

  setupController: function(controller, model) {
    this._super(controller, model);
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

  resolveVmtRoom(submission) {
    let roomId = submission.get('vmtRoomInfo.roomId');
    let utils = this.get('utils');

    if (!utils.isValidMongoId(roomId)) {
      return Ember.RSVP.resolve(null);
    }

    let cachedRoom = this.extractVmtRoom(roomId);

    if (cachedRoom) {
      return Ember.RSVP.resolve(cachedRoom);
    }
    let url = `api/vmt/rooms/${roomId}`;
      return Ember.$.get({
        url,
      })
      .then((data) => {
        if (!data || !data.room) {
          return null;
        }
        // put result on window if necessary

        this.handleRoomForVmt(data.room);

        return data.room;
      });

  },

  handleRoomForVmt(room) {
    let utils = this.get('utils');
    if (!utils.isNonEmptyObject(window.vmtRooms)) {
      window.vmtRooms = {};
    }
    if (window.vmtRooms[room._id]) {
      // room is already on
      return;
    }
    window.vmtRooms[room._id] = room;
  },

  extractVmtRoom(roomId) {
    if (!this.get('utils').isNonEmptyObject(window.vmtRooms)) {
      return null;
    }

    return window.vmtRooms[roomId];
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
    },
    willTransition(transition) {
      let currentUrl = window.location.hash;
      let wasVmt = currentUrl.indexOf('?vmtRoomId=') !== -1;
      let willBeVmt = this.get('utils').isValidMongoId(transition.queryParams.vmtRoomId);
      if (wasVmt && !willBeVmt) {
        window.postMessage({
          messageType: 'DESTROY_REPLAYER',
        });
      }
    }
  }
});

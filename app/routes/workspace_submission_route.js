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
  utils: Ember.inject.service('utility-methods'),

  // doTransitionVmt: true,

  // queryParams: {
  //   vmtRoomId: {
  //     replace: true
  //   }
  // },

  model(params) {

    let { submission_id, vmtRoomId } = params;

    // if (this.get('utils').isValidMongoId(vmtRoomId)) {
    //   // do not need to transition again
    //   this.set('doTransitionVmt', false);
    // }

    let submissions = this.modelFor('workspace.submissions');
    let submission = submissions.findBy('id', submission_id);

    return submission;
  },

  afterModel(submission, transition) {

    return this.resolveVmtRoom(submission)
    .then((room) => {
      if (!room) {
        return;
      }
      let vmtRoomId = room._id;
      let workspace = this.modelFor('workspace');
      this.transitionTo(`/workspaces/${workspace.get('id')}/submissions/${submission.get('id')}?vmtRoomId=${vmtRoomId}`);
    });
  },

  // redirect(submission, transition) {
  //   return this.resolveVmtRoom(submission)
  //   .then((room) => {
  //     console.log('rd', room, submission);
  //     if (!room) {
  //       return;
  //     }
  //     let vmtRoomId = room._id;
  //     let workspace = this.modelFor('workspace');
  //     this.transitionTo('workspace.submission', workspace, submission, {queryParams: {vmtRoomId}} );
  //   });
  // },

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

      return Ember.$.get({
        url: `/api/vmt/rooms/${roomId}`
      })
      .then((data) => {

        if (!data || !data.room) {
          return null;
        }
        // put room on window if necessary

        this.handleRoomForVmt(data.room);
        this.combineVmtRoomEvents(data.room);

        return data.room;
      });

  },

  handleRoomForVmt(room) {
    let utils = this.get('utils');
    console.log('handingling for vmt', window.vmtRooms);
    if (!utils.isNonEmptyObject(window.vmtRooms)) {
      window.vmtRooms = {};
    }
    if (window.vmtRooms[room._id]) {
      // room is already on
      return;
    }
    console.log('setting room', room._id);
    window.vmtRooms[room._id] = room;
  },

  extractVmtRoom(roomId) {
    if (!this.get('utils').isNonEmptyObject(window.vmtRooms)) {
      return null;
    }

    return window.vmtRooms[roomId];
  },

  combineVmtRoomEvents(room) {
    if (!Array.isArray(room.tabs)) {
      return;
    }
    let allEvents = [];

    room.tabs.forEach(tab => {
      allEvents = allEvents.concat(tab.events);
    });
    allEvents = allEvents
      .concat(room.chat)
      .sort((a, b) => a.timestamp - b.timestamp)
      .filter((entry, i, arr) => {
        if (arr[i - 1]) {
          if (entry.description) {
            return entry.description !== arr[i - 1].description;
          } else {
            return true;
          }
        }
        return true;
      });
    room.log = allEvents;
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

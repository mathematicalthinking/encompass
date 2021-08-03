/**
  * # Workspace Submission Route
  * @description This route renders the templates for working on a submission in a workspace
    model: a single submission (the current submission)
  * @author Damola Mabogunje <damola@mathforum.org>, Amir Tahvildaran <amir@mathforum.org>
  * @since 1.0.1
  * @see workspace_submissions_route
  */
/*global _:false */
import Route from '@ember/routing/route';
import { schedule } from '@ember/runloop';
import { inject as service } from '@ember/service';
import $ from 'jquery';
import { resolve } from 'rsvp';
import CurrentUserMixin from '../mixins/current_user_mixin';
import VmtHostMixin from '../mixins/vmt-host';

export default Route.extend(CurrentUserMixin, VmtHostMixin, {
  alert: service('sweet-alert'),
  utils: service('utility-methods'),

  queryParams: 'vmtRoomId',

  async model(params) {
    let { submission_id } = params;

    let submissions = this.modelFor('workspace.submissions');
    let submission = await submissions.findBy('id', submission_id);

    return submission;
  },

  afterModel(submission, transition) {
    return this.resolveVmtRoom(submission).then((room) => {
      if (!room) {
        return;
      }
      let vmtRoomId = room._id;

      // so links to selections still work
      if (transition.intent.name === 'workspace.submission') {
        this.transitionTo('workspace.submission', submission, {
          queryParams: { vmtRoomId },
        });
      }
    });
  },

  setupController: function (controller, model) {
    this._super(controller, model);
  },

  activate: function () {
    this.controllerFor('application').set('isSmallHeader', true);
  },

  deactivate: function () {
    this.controllerFor('application').set('isSmallHeader', false);
  },

  renderTemplate: function (controller, model) {
    this.render();

    let user = this.modelFor('application');

    schedule('afterRender', () => {
      if (!user.get('seenTour')) {
        this.controller.send('startTour', 'workspace');
      }
    });
  },

  resolveVmtRoom(submission) {
    let roomId = submission.get('vmtRoomInfo.roomId');
    let utils = this.utils;

    if (!utils.isValidMongoId(roomId)) {
      return resolve(null);
    }

    let cachedRoom = this.extractVmtRoom(roomId);

    if (cachedRoom) {
      return resolve(cachedRoom);
    }
    let url = `api/vmt/rooms/${roomId}`;
    return $.get({
      url,
    }).then((data) => {
      if (!data || !data.room) {
        return null;
      }
      // put result on window if necessary

      this.handleRoomForVmt(data.room);

      return data.room;
    });
  },

  handleRoomForVmt(room) {
    let utils = this.utils;
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
    if (!this.utils.isNonEmptyObject(window.vmtRooms)) {
      return null;
    }

    return window.vmtRooms[roomId];
  },

  actions: {
    reload: function () {
      this.refresh();
    },

    addSelection: function (selection) {},

    tagSelection: function (selection, tags) {
      var route = this;
      var workspace = this.modelFor('workspace');
      workspace.get('folders').then(function (folders) {
        var lcFolders = {};
        folders.forEach(function (f) {
          lcFolders[f.get('name').toLowerCase().replace(/\s+/g, '')] = f;
        });
        tags.forEach(function (tag) {
          if (_.keys(lcFolders).includes(tag)) {
            route.send(
              'fileSelectionInFolder',
              selection.get('id'),
              lcFolders[tag]
            );
          }
        });
      });
    },
    fileSelectionInFolder: function (selectionId, folder) {
      let selection = this.store.peekRecord('selection', selectionId);
      let workspace = this.modelFor('workspace');

      if (!selection) {
        return;
      }
      let tagging = this.store.createRecord('tagging', {
        workspace,
        selection,
        folder,
        createdBy: this.currentUser,
      });
      tagging
        .save()
        .then((savedTagging) => {
          this.alert.showToast(
            'success',
            'Selection Filed',
            'bottom-end',
            3000,
            false,
            null
          );
        })
        .catch((err) => {
          console.log('err save tagging', err);
        });
    },
    willTransition(transition) {
      let currentUrl = window.location.hash;
      let wasVmt = currentUrl.indexOf('?vmtRoomId=') !== -1;
      let willBeVmt = this.utils.isValidMongoId(
        transition.queryParams.vmtRoomId
      );
      if (wasVmt && !willBeVmt) {
        window.postMessage({
          messageType: 'DESTROY_REPLAYER',
        });
      }
    },
  },
});

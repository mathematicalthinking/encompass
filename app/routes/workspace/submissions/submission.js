/**
  * # Workspace Submission Route
  * @description This route renders the templates for working on a submission in a workspace
    model: a single submission (the current submission)
  * @author Damola Mabogunje <damola@mathforum.org>, Amir Tahvildaran <amir@mathforum.org>
  * @since 1.0.1
  * @see workspace_submissions_route
  */

import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { schedule } from '@ember/runloop';
import { hash, resolve } from 'rsvp';
import { action } from '@ember/object';

export default class WorkspaceSubmissionsSubmissionRoute extends Route {
  @service('sweet-alert') alert;
  @service utils;
  @service currentUser;

  queryParams = {
    vmtRoomId: {
      refreshModel: false,
    },
  };

  async model({ submission_id }) {
    const submissions = await this.modelFor('workspace.submissions');
    const workspace = await this.modelFor('workspace');
    const assignment = await workspace.linkedAssignment;

    return hash({
      workspace,
      assignment,
      submission: submissions.findBy('id', submission_id),
    });
  }

  async afterModel(model, transition) {
    const room = await this.resolveVmtRoom(model);
    if (!room) return;

    if (transition.to.name === 'workspace.submissions.submission') {
      this.transitionTo('workspace.submissions.submission', model, {
        queryParams: { vmtRoomId: room._id },
      });
    }
  }

  setupController(controller, model) {
    super.setupController(controller, model);
  }

  resetController(controller, isExiting, transition) {
    if (isExiting && transition.to.name !== 'error') {
      controller.itemsToDisplay = 'all';
    }
  }

  renderTemplate(controller) {
    this.render('workspace/submission');

    const user = this.modelFor('application');
    schedule('afterRender', () => {
      if (!user.seenTour) {
        controller.send('startTour', 'workspace');
      }
    });
  }

  async resolveVmtRoom(submission) {
    const roomId =
      submission?.submission?.vmtRoomInfo?.roomId ||
      submission?.vmtRoomInfo?.roomId;

    if (!this.utils.isValidMongoId(roomId)) {
      return resolve(null);
    }

    const cachedRoom = this.extractVmtRoom(roomId);
    if (cachedRoom) return resolve(cachedRoom);

    try {
      const response = await fetch(`api/vmt/rooms/${roomId}`);
      if (!response.ok)
        throw new Error(`Network response was not ok: ${response.statusText}`);

      const data = await response.json();
      if (!data?.room) return null;

      this.handleRoomForVmt(data.room);
      return data.room;
    } catch (err) {
      console.error('Error fetching VMT room:', err);
      return null;
    }
  }

  handleRoomForVmt(room) {
    if (!this.utils.isNonEmptyObject(window.vmtRooms)) {
      window.vmtRooms = {};
    }
    if (!window.vmtRooms[room._id]) {
      window.vmtRooms[room._id] = room;
    }
  }

  extractVmtRoom(roomId) {
    return this.utils.isNonEmptyObject(window.vmtRooms)
      ? window.vmtRooms[roomId]
      : null;
  }

  @action
  reload() {
    this.refresh();
  }

  @action
  tagSelection(selection, tags) {
    const workspace = this.modelFor('workspace');
    workspace.folders.then((folders) => {
      const lcFolders = {};
      folders.forEach((f) => {
        lcFolders[f.name.toLowerCase().replace(/\s+/g, '')] = f;
      });

      tags.forEach((tag) => {
        if (Object.keys(lcFolders).includes(tag)) {
          this.fileSelectionInFolder(selection.id, lcFolders[tag]);
        }
      });
    });
  }

  fileSelectionInFolder(selectionId, folder) {
    const selection = this.store.peekRecord('selection', selectionId);
    const workspace = this.modelFor('workspace');

    if (!selection) return;

    const tagging = this.store.createRecord('tagging', {
      workspace,
      selection,
      folder,
      createdBy: this.currentUser.user,
    });

    tagging
      .save()
      .then(() => {
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
        console.error('Error saving tagging:', err);
      });
  }

  @action
  willTransition(transition) {
    const wasVmt = window.location.hash.includes('?vmtRoomId=');
    const willBeVmt = this.utils.isValidMongoId(
      transition.to.queryParams.vmtRoomId
    );
    if (wasVmt && !willBeVmt) {
      window.postMessage({ messageType: 'DESTROY_REPLAYER' });
    }
  }
}

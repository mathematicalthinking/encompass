/*global io:false */
/*global _:false */
import Service, { inject as service } from '@ember/service';
import CurrentUserMixin from '../mixins/current_user_mixin';






export default Service.extend(CurrentUserMixin, {
  store: service(),
  alert: service('sweet-alert'),
  utils: service('utility-methods'),

  init() {
    this._super(...arguments);
  },

  setupListeners() {
    const socket = this.socket;
    const utils = this.utils;

    if (!socket) {
      return;
    }

    socket.on('NEW_NOTIFICATION', (data) => {
      _.each(data, (val, key) => {
        if (val) {
          this.store.pushPayload(
            {
              [key]: val
            }
          );
        }
      });


      let ntf = data.notifications[0];
      if (!ntf) {
        return;
      }

      let recordType = ntf.primaryRecordType;

      if (recordType === 'response') {
        if (ntf.notificationType === 'newWorkToMentor') {
          // special case, associated submission, not response
          if (data.submissions && data.submissions[0]) {
            let subId = data.submissions[0]._id;

            if (subId) {
              let newRevision = this.store.peekRecord('submission', subId);

              if (newRevision) {

                let uniqueId = ntf.workspace + ntf.createdBy;
                let existingThread = this.findExistingResponseThread('mentor', uniqueId);

                // should always be existing thread
                if (existingThread) {
                  existingThread.get('submissions').addObject(newRevision);
                }
              }
            }
          }
        } else if (data.responses && data.responses[0]) {
          this.handleResponseNtf(ntf, data.responses[0], data.workspaceName);

        }
      }
      // check if we need to clear any now outdated notifications

      this.triggerToast(ntf);
    });

    socket.on('CLEAR_NOTIFICATION', (data) => {
      /*
      data {
        notificationId,
        doTrash,
        doSetAsSeen
      }
      */
      if (this.utils.isValidMongoId(data.notificationId)) {
        let peeked = this.store.peekRecord('notification', data.notificationId);
        if (!peeked) {
          return;
        }

        let doSave = data.doTrash || data.doSetAsSeen;

        if (!doSave) {
          this.store.unloadRecord(peeked);
          return;
        }
        if (data.doTrash) {
          peeked.set('isTrashed', true);
        }
        if (data.doSetAsSeen) {
          peeked.set('wasSeen', true);
        }
        peeked.save();
      }
    });

    socket.on('CLEAR_RECORD', (data) => {
      if (!utils.isNonEmptyObject(data)) {
        return;
      }
      let { recordIdToClear, recordType } = data;

      if (!utils.isValidMongoId(recordIdToClear) || !utils.isNonEmptyString(recordType)) {
        return;
      }

      let peeked = this.store.peekRecord(data.recordType, data.recordIdToClear);

      if (!peeked) {
        return;
      }

      if (recordType === 'response') {
        this.store.peekAll('response-thread').forEach((thread) => {
          let responseIds = utils.getHasManyIds(thread, 'responses');
          let doesContainResponse = responseIds.includes(peeked.get('id'));

          if (doesContainResponse && responseIds.get('length') === 1) {
            // thread will be empty after unloading record, so trash thread
            thread.set('isTrashed', true);
          }
        });
      }

      this.store.unloadRecord(peeked);


    });
    socket.on('UPDATED_RECORD', (data) => {
      if (data) {
        let recordType = data.recordType;

        this.store.pushPayload({
          [recordType]: data.updatedRecord
        });
      }
    });
  },

  setupSocket: function (user) {
    let windowHref = window.location.href;
    let hashIndex = windowHref.indexOf('#');
    let url = windowHref.slice(0, hashIndex);

    const socket = io.connect(url);
    this.set('socket', socket);

    user.set('socketId', socket.id);
    user.save()
      .then(() => {
        this.setupListeners();
      });
  },

  triggerToast(ntf) {
    if (!ntf) {
      return;
    }
    let ntfText = ntf.text;
    let toastText;
    if (ntfText) {
      toastText = ntfText;
    } else {
      let notificationType = ntf.notificationType;
      toastText = `You have received a ${notificationType} notification.`;
    }
    this.alert.showToast('info', toastText, 'top-end', 3000, false, null);
    return;
  },

  handleResponseNtf(ntf, newResponseObj, workspaceName) {

    let { notificationType } = ntf;
    let workspaceId = newResponseObj.workspace;
    let newResponse = this.store.peekRecord('response', newResponseObj._id);
    let submission = this.store.peekRecord('submission', newResponseObj.submission);

    let responseCreatorId = this.utils.getBelongsToId(newResponse, 'createdBy');
    let problemTitle;
    let studentIdentifier; // encUserId or pows username
    let studentDisplay;

    if (submission) {
      problemTitle = submission.get('publication.puzzle.title');
      studentDisplay = submission.get('creator.username');

      if (submission.get('creator.studentId')) {
        studentIdentifier = submission.get('creator.studentId');
      } else {
        studentIdentifier = submission.get('creator.username');
      }
    }

    if (notificationType === 'newMentorReply') {
      let uniqueId = `srt${workspaceId}`;
      let existingThread = this.findExistingResponseThread('submitter', uniqueId);
      if (existingThread) {
        existingThread.get('responses').addObject(newResponse);
      } else {

        // create new thread
        let newThread = this.store.createRecord('response-thread', {
          threadType: 'submitter',
          uniqueIdentifier: workspaceId,
          workspaceName,
          mentors: [responseCreatorId],
          problemTitle,
          id: uniqueId,
          isNewThread: true,
          studentDisplay,
        });
        newThread.get('submissions').addObject(submission);
        newThread.get('responses').addObject(newResponse);
      }
    }

    if (notificationType === 'newApproverReply') {
      // identifier is object with workspaceId and studentId

      let uniqueId = workspaceId + studentIdentifier;

      let existingThread = this.findExistingResponseThread('mentor', uniqueId);
      if (existingThread) {
        existingThread.get('responses').addObject(newResponse);
      } else {
        // should always be existing mentoring thread
      }
    }
    if (notificationType === 'mentorReplyRequiresApproval') {
      let uniqueId = workspaceId + studentIdentifier + responseCreatorId;

      let existingThread = this.findExistingResponseThread('approver', uniqueId);
      if (existingThread) {
        existingThread.get('responses').addObject(newResponse);
      } else {
        // create new approver thread
        let newThread = this.store.createRecord('response-thread', {
          threadType: 'approver',
          id: uniqueId,
          workspaceName,
          mentors: [responseCreatorId],
          problemTitle,
          isNewThread: true,
          studentDisplay
        });
        newThread.get('submissions').addObject(submission);
        newThread.get('responses').addObject(newResponse);
      }

    }
  },

  findExistingResponseThread(threadType, uniqueIdentifier) {
    let peekedResponseThreads = this.store.peekAll('response-thread').toArray();
    if (!peekedResponseThreads) {
      return;
    }

    return peekedResponseThreads.find((thread) => {
      return thread.get('threadType') === threadType && _.isEqual(thread.get('id'), uniqueIdentifier);
    });

  }
});

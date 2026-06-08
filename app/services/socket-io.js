import Service, { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import each from 'lodash-es/each';
import isEqual from 'lodash-es/isEqual';
import io from 'socket.io-client';

export default class SocketIoService extends Service {
  @service store;
  @service('sweet-alert') alert;
  @service('utility-methods') utils;

  @tracked socket = null;

  setupListeners() {
    const socket = this.socket;

    if (!socket) {
      return;
    }

    socket.on('NEW_NOTIFICATION', (data) => {
      each(data, (value, key) => {
        if (value) {
          this.store.pushPayload({
            [key]: value,
          });
        }
      });

      const notification = data.notifications[0];
      if (!notification) {
        return;
      }

      if (notification.primaryRecordType === 'response') {
        if (notification.notificationType === 'newWorkToMentor') {
          if (data.submissions && data.submissions[0]) {
            const submissionId = data.submissions[0]._id;

            if (submissionId) {
              const newRevision = this.store.peekRecord(
                'submission',
                submissionId
              );

              if (newRevision) {
                const uniqueId =
                  notification.workspace + notification.createdBy;
                const existingThread = this.findExistingResponseThread(
                  'mentor',
                  uniqueId
                );

                if (existingThread) {
                  existingThread.get('submissions').addObject(newRevision);
                }
              }
            }
          }
        } else if (data.responses && data.responses[0]) {
          this.handleResponseNtf(
            notification,
            data.responses[0],
            data.workspaceName
          );
        }
      }

      this.triggerToast(notification);
    });

    socket.on('CLEAR_NOTIFICATION', (data) => {
      if (!this.utils.isValidMongoId(data.notificationId)) {
        return;
      }

      const notification = this.store.peekRecord(
        'notification',
        data.notificationId
      );
      if (!notification) {
        return;
      }

      const shouldSave = data.doTrash || data.doSetAsSeen;

      if (!shouldSave) {
        this.store.unloadRecord(notification);
        return;
      }
      if (data.doTrash) {
        notification.isTrashed = true;
      }
      if (data.doSetAsSeen) {
        notification.wasSeen = true;
      }
      notification.save();
    });

    socket.on('CLEAR_RECORD', (data) => {
      if (!this.utils.isNonEmptyObject(data)) {
        return;
      }

      const { recordIdToClear, recordType } = data;

      if (
        !this.utils.isValidMongoId(recordIdToClear) ||
        !this.utils.isNonEmptyString(recordType)
      ) {
        return;
      }

      const record = this.store.peekRecord(recordType, recordIdToClear);

      if (!record) {
        return;
      }

      if (recordType === 'response') {
        this.store.peekAll('response-thread').forEach((thread) => {
          const responseIds = this.utils.getHasManyIds(thread, 'responses');
          const containsResponse = responseIds.includes(record.id);

          if (containsResponse && responseIds.length === 1) {
            thread.isTrashed = true;
          }
        });
      }

      this.store.unloadRecord(record);
    });

    socket.on('UPDATED_RECORD', (data) => {
      if (data) {
        this.store.pushPayload({
          [data.recordType]: data.updatedRecord,
        });
      }
    });
  }

  setupSocket(user) {
    const windowHref = window.location.href;
    const hashIndex = windowHref.indexOf('#');
    const url = hashIndex === -1 ? windowHref : windowHref.slice(0, hashIndex);

    this.socket = io.connect(url);

    user.socketId = this.socket.id;
    user.save().then(() => {
      this.setupListeners();
    });
  }

  triggerToast(notification) {
    if (!notification) {
      return;
    }

    const toastText =
      notification.text ||
      `You have received a ${notification.notificationType} notification.`;

    this.alert.showToast('info', toastText, 'top-end', 3000, false, null);
  }

  handleResponseNtf(notification, newResponseObject, workspaceName) {
    const { notificationType } = notification;
    const workspaceId = newResponseObject.workspace;
    const newResponse = this.store.peekRecord(
      'response',
      newResponseObject._id
    );
    const submission = this.store.peekRecord(
      'submission',
      newResponseObject.submission
    );

    const responseCreatorId = this.utils.getBelongsToId(
      newResponse,
      'createdBy'
    );
    let problemTitle;
    let studentIdentifier;
    let studentDisplay;

    if (submission) {
      problemTitle = submission.get('publication.puzzle.title');
      studentDisplay = submission.get('creator.username');
      studentIdentifier =
        submission.get('creator.studentId') ||
        submission.get('creator.username');
    }

    if (notificationType === 'newMentorReply') {
      const uniqueId = `srt${workspaceId}`;
      const existingThread = this.findExistingResponseThread(
        'submitter',
        uniqueId
      );

      if (existingThread) {
        existingThread.get('responses').addObject(newResponse);
      } else {
        const newThread = this.store.createRecord('response-thread', {
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
      const uniqueId = workspaceId + studentIdentifier;
      const existingThread = this.findExistingResponseThread(
        'mentor',
        uniqueId
      );

      if (existingThread) {
        existingThread.get('responses').addObject(newResponse);
      }
    }

    if (notificationType === 'mentorReplyRequiresApproval') {
      const uniqueId = workspaceId + studentIdentifier + responseCreatorId;
      const existingThread = this.findExistingResponseThread(
        'approver',
        uniqueId
      );

      if (existingThread) {
        existingThread.get('responses').addObject(newResponse);
      } else {
        const newThread = this.store.createRecord('response-thread', {
          threadType: 'approver',
          id: uniqueId,
          workspaceName,
          mentors: [responseCreatorId],
          problemTitle,
          isNewThread: true,
          studentDisplay,
        });
        newThread.get('submissions').addObject(submission);
        newThread.get('responses').addObject(newResponse);
      }
    }
  }

  findExistingResponseThread(threadType, uniqueIdentifier) {
    const responseThreads = this.store.peekAll('response-thread').toArray();

    return responseThreads.find((thread) => {
      return (
        thread.get('threadType') === threadType &&
        isEqual(thread.get('id'), uniqueIdentifier)
      );
    });
  }
}

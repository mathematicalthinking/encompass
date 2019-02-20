/*global io:false */
/*global _:false */
Encompass.SocketIoService = Ember.Service.extend(Encompass.CurrentUserMixin, {
  store: Ember.inject.service(),
  alert: Ember.inject.service('sweet-alert'),
  utils: Ember.inject.service('utility-methods'),

  init() {
    this._super(...arguments);
  },

  setupListeners() {
    const socket = this.get('socket');
    if (!socket) {
      return;
    }

    socket.on('NEW_NOTIFICATION', (data) => {
      console.log('emitting ntf', data);
     _.each(data, (val, key) => {
      if (val) {
        console.log('pushing payload', key, val);
        this.get('store').pushPayload(
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
             let newRevision = this.get('store').peekRecord('submission', subId);

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
      if (this.get('utils').isValidMongoId(data.notificationId)) {
        let peeked = this.get('store').peekRecord('notification', data.notificationId);
        console.log('clearing ntf', peeked);
        if (!peeked) {
          return;
        }

        let doSave = data.doTrash || data.doSetAsSeen;

        if (!doSave) {
          this.get('store').unloadRecord(peeked);
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
    this.get('alert').showToast('info', toastText, 'top-end', 3000, false, null);
    return;
  },

  handleResponseNtf(ntf, newResponseObj, workspaceName) {

    let { notificationType } = ntf;
    let workspaceId = newResponseObj.workspace;
    let newResponse = this.get('store').peekRecord('response', newResponseObj._id);
    let submission = this.get('store').peekRecord('submission', newResponseObj.submission);

    let problemTitle;
    let studentIdentifier; // encUserId or pows username

    if (submission) {
      problemTitle = submission.get('publication.puzzle.title');

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
       let newThread = this.get('store').createRecord('response-thread', {
         threadType: 'submitter',
         uniqueIdentifier: workspaceId,
         workspaceName,
         mentors: [newResponse.get('createdBy')],
         problemTitle
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
  },

  findExistingResponseThread(threadType, uniqueIdentifier) {
    let peekedResponseThreads = this.get('store').peekAll('response-thread').toArray();
    if (!peekedResponseThreads) {
      return;
    }

    return peekedResponseThreads.find((thread) => {
      return thread.get('threadType') === threadType && _.isEqual(thread.get('id'), uniqueIdentifier);
    });

  }
});

Encompass.ResponseMentorReplyComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {
  elementId: 'response-mentor-reply',
  alert: Ember.inject.service('sweet-alert'),
  utils: Ember.inject.service('utility-methods'),

  isRevising: false,
  isFinishingDraft: false,

  currentDisplayResponseId: null,


  didReceiveAttrs() {
    if (this.get('displayResponse.id') !== this.get('currentDisplayResponseId')) {
      this.set('currentDisplayResponseId', this.get('displayResponse.id'));

      ['isEditing', 'isRevising', 'isFinishingDraft'].forEach((prop) => {
        if (this.get(prop)) {
          this.set(prop, false);
        }
      });
    }
    this._super(...arguments);
  },
  statusIconFill: function () {
    let status = this.get('displayResponse.status');
    return this.get('iconFillOptions')[status];
  }.property('displayResponse.status'),

  showStatus: function() {
    return this.get('canApprove') || this.get('isOwnMentorReply');
  }.property('canApprove', 'isOwnMentorReply'),

  newReplyStatus: function() {
    if (this.get('canDirectSend')) {
      return 'approved';
    }
    return 'pendingApproval';
  }.property('canDirectSend'),

  canRevise: function() {
    return this.get('isOwnMentorReply');
  }.property('isOwnMentorReply'),

  canEdit: function() {
    return this.get('displayResponse.status') === 'pendingApproval' && (this.get('canApprove') || this.get('isOwnMentorReply'));
  }.property('canApprove', 'displayResponse.status', 'isOwnMentorReply'),

  isComposing: function() {
    return this.get('isEditing') || this.get('isRevising') || this.get('isFinishingDraft');
  }.property('isEditing', 'isRevising', 'isFinishingDraft'),

  showEdit: function() {
    return this.get('canEdit') && !this.get('isComposing');
  }.property('canEdit', 'isComposing'),

  isDraft: function() {
    return this.get('displayResponse.status') === 'draft';
  }.property('displayResponse.status'),

  showRevise: function() {
    return this.get('canRevise') && !this.get('isDraft') && !this.get('isComposing');
  }.property('canRevise', 'isComposing', 'isDraft'),

  showResumeDraft: function() {
    return this.get('isOwnMentorReply') && this.get('isDraft') && !this.get('isComposing');
  }.property('isOwnMentorReply', 'isDraft', 'isComposing'),

  responseNewModel: function() {
    if (this.get('isCreating')) {
      return this.get('response');
    }
    return this.get('displayResponse');
  }.property('isCreating', 'response', 'displayResponse'),
  replyHeadingText: function() {
    if (this.get('isEditing')) {
      return 'Editing Mentor Reply';
    }
    if (this.get('isRevising')) {
      return 'New Revision';
    }
  }.property('isEditing', 'isRevising'),
  showApproverNoteInput: function() {
    return this.get('newReplyStatus') !== 'approved';
  }.property('newReplyStatus'),
  sortedMentorReplies: function() {
    if (!this.get('mentorReplies')) {
      return [];
    }
    return this.get('mentorReplies')
      .rejectBy('isTrashed')
      .sortBy('createDate');
  }.property('mentorReplies.@each.isTrashed'),
  showNote: function() {
    if (!this.get('isOwnMentorReply') && !this.get('canApprove')) {
      return false;
    }
    let note = this.get('displayResponse.note');
    return typeof note === 'string' && note.length > 0;
  }.property('isOwnMentorReply', 'canApprove', 'displayResponse.note'),

  canTrash: function() {
    let status = this.get('displayResponse.status');

    return status === 'draft' || status === 'pendingApproval' && (this.get('isOwnMentorReply') || this.get('canApprove'));
  }.property('isOwnMentorReply', 'canApprove', 'displayResponse.status'),
  showTrash: function() {
    return this.get('canTrash') && !this.get('isComposing');
  }.property('canTrash', 'isComposing'),
  canSendNew: function() {
    return this.get('canSend') && !this.get('isOwnSubmission');
  }.property('canSend', 'isOwnSubmission'),

  sendButtonText: function() {
    if (this.get('canDirectSend')) {
      return 'Send';
    }
    return 'Submit for Approval';
  }.property('canDirectSend'),

  actions: {
    onSaveSuccess(submission, response) {
      this.get('onSaveSuccess')(submission, response);
    },
    startEditing() {
      this.set('editRevisionText', this.get('displayResponse.text'));
      this.set('editRevisionNote', this.get('displayResponse.note'));
      this.set('isEditing', true);
    },
    stopEditing() {
      this.set('isEditing', false);
      this.set('editRevisionText', '');
      this.set('editRevisionNote', '');
      this.removeMessages(['saveRecordErrors','emptyReplyError']);
    },
    stopDraft() {
      this.set('isFinishingDraft', false);
      this.set('editRevisionText', '');
      this.set('editRevisionNote', '');
      this.removeMessages(['saveRecordErrors','emptyReplyError']);
    },
    startRevising() {
      this.set('editRevisionText', this.get('displayResponse.text'));
      this.set('editRevisionNote', this.get('displayResponse.note'));

      this.set('isRevising', true);
    },
    resumeDraft() {
      this.set('editRevisionText', this.get('displayResponse.text'));
      this.set('editRevisionNote', this.get('displayResponse.note'));
      this.set('isFinishingDraft', true);
    },

    saveDraft(isDraft) {
      let messageBody = this.get('editRevisionText');

      if (!messageBody || messageBody.length === 0) {
        this.set('emptyReplyError', true);
        return;
      }

      let approverNote = this.get('editRevisionNote');

      this.get('displayResponse').set('text', messageBody);
      this.get('displayResponse').set('note', approverNote);

      let doSetSuperceded = false;

      let priorRevisionStatus = this.get('priorMentorRevision.status');
      if (priorRevisionStatus === 'pendingApproval' || priorRevisionStatus === 'needsRevisions' ) {
        doSetSuperceded = true;
        this.get('priorMentorRevision').set('status', 'superceded');
      }

      let newStatus = this.get('newReplyStatus');
      let toastMessage = 'Response Sent';

      if (newStatus === 'pendingApproval') {
        toastMessage = 'Response Sent for Approval';
      }
      if (isDraft) {
        newStatus = 'draft';
        toastMessage = 'Draft Saved';
      }


      this.get('displayResponse').set('status', newStatus);

      let hash = {
        newResponse: this.get('displayResponse').save(),
      };
      if (doSetSuperceded) {
        hash.priorRevision = this.get('priorMentorRevision').save();
      }
      Ember.RSVP.hash(hash)
        .then((hash) => {
          this.get('alert').showToast('success', toastMessage, 'bottom-end', 3000, false, null);
          this.set('isFinishingDraft', false);
          this.set('editRevisionText', '');
        })
        .catch((err) => {
          this.handleErrors(err, 'saveRecordErrors', this.get('displayResponse'));
        });
    },

    stopRevising() {
      this.set('isRevising', false);
      this.set('editRevisionText', '');
      this.set('editRevisionNote', '');
      this.removeMessages(['saveRecordErrors','emptyReplyError']);

    },
    saveEdit() {
      this.removeMessages(['saveRecordErrors','emptyReplyError']);

      let oldText = this.get('displayResponse.text');
      let newText = this.get('editRevisionText');

      let oldNote = this.get('displayResponse.note');
      let newNote = this.get('editRevisionNote');

      if (oldText === newText && oldNote === newNote) {
        this.set('isEditing', false);
        return;
      }
      if (!newText || newText.length === 0) {
        this.set('emptyReplyError', true);
        return;
      }
      this.get('displayResponse').set('text', newText);
      this.get('displayResponse').set('note', newNote);

      this.get('displayResponse').save()
        .then((saved) => {
          this.get('alert').showToast('success', 'Response Updated', 'bottom-end', 3000, false, null);
          this.set('isEditing', false);
          this.set('editRevisionText', '');
        })
        .catch((err) => {
          this.handleErrors(err, 'saveRecordErrors');
        });
    },

    saveRevision(isDraft) {
      this.removeMessages(['saveRecordErrors','emptyReplyError']);

      let oldText = this.get('displayResponse.text');
      let newText = this.get('editRevisionText');

      let oldNote = this.get('displayResponse.note');
      let newNote = this.get('editRevisionNote');

      if (!isDraft) {
        if (oldText === newText && oldNote === newNote) {
          this.set('isRevising', false);
          return;
        }
      }

      if (!newText || newText.length === 0) {
        this.set('emptyReplyError', true);
        return;
      }

      let oldStatus = this.get('displayResponse.status');
      let doSetSuperceded = !isDraft && (oldStatus === 'pendingApproval' || oldStatus === 'needsRevisions');

      let copy = this.get('displayResponse').toJSON({includeId: false});
      delete copy.approvedBy;
      delete copy.lastModifiedDate;
      delete copy.lastModifiedBy;
      delete copy.comments;
      delete copy.selections;
      delete copy.wasReadByRecipient;
      delete copy.wasReadByApprover;

      copy.text = newText;
      copy.note = newNote;

      copy.createDate = new Date();

      let newReplyStatus = this.get('newReplyStatus');

      if (isDraft) {
        newReplyStatus = 'draft';
      }

      let revision = this.get('store').createRecord('response', copy);
      revision.set('createdBy', this.get('currentUser'));
      revision.set('submission', this.get('submission'));
      revision.set('workspace', this.get('workspace'));
      revision.set('priorRevision', this.get('displayResponse'));
      revision.set('recipient', this.get('displayResponse.recipient.content'));
      revision.set('status', newReplyStatus);

      let hash;
      let toastMessage = 'Revision Sent';

      if (isDraft) {
        toastMessage = 'Draft Saved';
      }

      if (doSetSuperceded) {
        this.get('displayResponse').set('status', 'superceded');

        hash = {
          revision: revision.save(),
          original: this.get('displayResponse').save()
        };
      } else {
          hash = {
            revision: revision.save()
          };
        }

      Ember.RSVP.hash(hash)
        .then((hash) => {
          this.get('alert').showToast('success', toastMessage, 'bottom-end', 3000, false, null);
          this.set('isRevising', false);
          this.set('editRevisionText', '');
          this.send('setDisplayMentorReply', hash.revision);

          // look for responseThread to add response to
          this.get('handleResponseThread')(hash.revision, 'mentor');
        })
        .catch((err) => {
          this.handleErrors(err, 'saveRecordErrors', null, [revision, this.get('displayResponse')]);
        });
    },
    setDisplayMentorReply(response) {
      if (!response) {
        return;
      }

      this.get('onMentorReplySwitch')(response);
    },

    confirmTrash(response) {
      if (!response) {
        return;
      }

      return this.get('alert').showModal('warning', 'Are you sure you want to delete this response?', '', 'Delete')
        .then((result) => {
          if (result.value) {
            response.set('isTrashed', true);
            return response.save();
          }
        })
        .then((saved) => {
          if(saved) {
            this.get('alert').showToast('success', 'Response Deleted', 'bottom-end', 3000, false, null);

            let prevResponse = this.get('sortedMentorReplies.lastObject') || null;
            this.get('onSaveSuccess')(this.get('submission'), prevResponse);
          }
        })
        .catch((err) => {
          this.handleErrors(err, 'recordSaveErrors', response);
        });

    },
    toNewResponse: function() {
      this.get('toNewResponse')();
    },
    handleNewMentorReply(response, threadType) {
      this.get('handleResponseThread')(response, threadType);
    }
 }
});
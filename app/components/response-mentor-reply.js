Encompass.ResponseMentorReplyComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {
  elementId: 'response-mentor-reply',
  alert: Ember.inject.service('sweet-alert'),

  didReceiveAttrs() {
    this._super(...arguments);
  },

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
    return this.get('isEditing') || this.get('isRevising');
  }.property('isCreating', 'isEditing', 'isRevising'),

  showEdit: function() {
    return this.get('canEdit') && !this.get('isComposing');
  }.property('canEdit', 'isComposing'),

  showRevise: function() {
    return this.get('canRevise') && !this.get('isComposing');
  }.property('canEdit', 'isComposing'),
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
      .sortBy('createDate')
      .reverse();

  }.property('mentorReplies.@each.isTrashed'),
  showNote: function() {
    return this.get('isOwnMentorReply') || this.get('canApprove');
  }.property('isOwnMentorReply', 'canApprove'),

  canTrash: function() {
    return this.get('displayResponse.status') === 'pendingApproval' && (this.get('isOwnMentorReply') || this.get('canApprove'));
  }.property('isOwnMentorReply', 'canApprove', 'displayResponse.status'),
  showTrash: function() {
    return this.get('canTrash') && !this.get('isComposing');
  }.property('canTrash', 'isComposing'),

  actions: {
    onSaveSuccess(response) {
      this.get('onSaveSuccess')(response);
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
    startRevising() {
      this.set('editRevisionText', this.get('displayResponse.text'));
      this.set('editRevisionNote', this.get('displayResponse.note'));

      this.set('isRevising', true);
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

    saveRevision() {
      this.removeMessages(['saveRecordErrors','emptyReplyError']);

      let oldText = this.get('displayResponse.text');
      let newText = this.get('editRevisionText');

      let oldNote = this.get('displayResponse.note');
      let newNote = this.get('editRevisionNote');

      if (oldText === newText && oldNote === newNote) {
        this.set('isRevising', false);
        return;
      }
      if (!newText || newText.length === 0) {
        this.set('emptyReplyError', true);
        return;
      }

      let oldStatus = this.get('displayResponse.status');
      let doSetSuperceded = oldStatus === 'pendingApproval' || oldStatus === 'needsRevisions';

      let copy = this.get('displayResponse').toJSON({includeId: false});
      delete copy.approvedBy;
      delete copy.lastModifiedDate;
      delete copy.lastModifiedBy;
      delete copy.comments;
      delete copy.selections;

      copy.text = newText;
      copy.note = newNote;

      copy.createDate = new Date();
      let revision = this.get('store').createRecord('response', copy);
      revision.set('createdBy', this.get('currentUser'));
      revision.set('submission', this.get('submission'));
      revision.set('workspace', this.get('workspace'));
      revision.set('priorRevision', this.get('displayResponse'));
      revision.set('recipient', this.get('displayResponse.recipient.content'));
      revision.set('status', this.get('newReplyStatus'));

      let hash;

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
          this.get('alert').showToast('success', 'Revision Sent', 'bottom-end', 3000, false, null);
          this.set('isRevising', false);
          this.set('editRevisionText', '');
          this.send('setDisplayMentorReply', hash.revision);
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
      console.log('mentorReplies', this.get('mentorReplies'));

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
             this.get('toResponses')();
          }
          // just go to responses page for now?
        })
        .catch((err) => {
          this.handleErrors(err, 'recordSaveErrors', response);
        });

    }
 }
});
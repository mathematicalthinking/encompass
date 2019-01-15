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

  actions: {
    onSaveSuccess(response) {
      this.get('onSaveSuccess')(response);
    },
    startEditing() {
      this.set('editRevisionText', this.get('displayResponse.text'));
      this.set('isEditing', true);
    },
    stopEditing() {
      this.set('editRevisionText', '');
      this.set('isEditing', false);
    },
    startRevising() {
      this.set('editRevisionText', this.get('displayResponse.text'));
      this.set('isRevising', true);
    },
    stopRevising() {
      this.set('editRevisionText', '');
      this.set('isRevising', false);
    },
    saveEdit() {
      let oldText = this.get('displayResponse.text');
      let newText = this.get('editRevisionText');
      if (oldText === newText) {
        this.set('isEditing', false);
        return;
      }
      if (!newText || newText.length === 0) {
        this.set('emptyReplyError', true);
        return;
      }
      this.get('displayResponse').set('text', newText);

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
      let oldText = this.get('displayResponse.text');
      let newText = this.get('editRevisionText');
      if (oldText === newText) {
        this.set('isRevising', false);
        return;
      }
      if (!newText || newText.length === 0) {
        this.set('emptyReplyError', true);
        return;
      }

      let copy = this.get('displayResponse').toJSON({includeId: false});
      console.log('copy', copy);
      delete copy.approvedBy;
      delete copy.lastModifiedDate;
      delete copy.lastModifiedBy;

      copy.text = newText;
      copy.createDate = new Date();
      let revision = this.get('store').createRecord('response', copy);
      revision.set('createdBy', this.get('currentUser'));
      revision.set('submission', this.get('displayResponse.submission'));
      revision.set('workspace', this.get('displayResponse.workspace'));
      revision.set('priorRevision', this.get('displayResponse'));

      console.log('revis', revision);
      revision.save()
        .then((saved) => {
          this.get('alert').showToast('success', 'Revision Sent', 'bottom-end', 3000, false, null);
          this.set('isRevising', false);
          this.set('editRevisionText', '');
          this.get('mentorReplies').addObject(saved);
        })
        .catch((err) => {
          this.handleErrors(err, 'saveRecordErrors');
        });


    }
  }
});
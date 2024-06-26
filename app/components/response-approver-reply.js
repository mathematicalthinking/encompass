import Component from '@ember/component';
import { hash } from 'rsvp';
import { computed } from '@ember/object';
import { equal } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  elementId: 'response-approver-reply',
  alert: service('sweet-alert'),
  utils: service('utility-methods'),
  errorHandling: service('error-handling'),
  loading: service('loading-display'),
  currentUser: service('current-user'),
  showNoPreviousRepliesMsg: equal('approverReplies.length', 0),
  replyToView: null,
  quillEditorId: 'approver-editor',
  quillText: '',
  maxResponseLength: 14680064,

  errorPropsToRemove: [
    'saveRecordErrors',
    'emptyReplyError',
    'quillTooLongError',
  ],

  statusIconFill: computed(
    'displayReply.status',
    'iconFillOptions',
    function () {
      let status = this.get('displayReply.status');
      return this.iconFillOptions[status];
    }
  ),

  didReceiveAttrs() {
    if (!this.get('approverReplies.length') > 0) {
      this.set('replyToView', null);
    }
    let primaryReply = this.primaryReply;

    let responseToSet;

    if (primaryReply) {
      responseToSet = primaryReply;
    } else if (this.get('sortedApproverReplies.lastObject')) {
      responseToSet = this.get('sortedApproverReplies.lastObject');
    } else {
      responseToSet = null;
    }
    if (responseToSet) {
      this.handleRecipientRead(responseToSet);
    }

    this.set('replyToView', responseToSet);

    this._super(...arguments);
  },

  handleRecipientRead(response) {
    let recipId = this.utils.getBelongsToId(response, 'recipient');
    if (
      recipId === this.get('currentUser.user.id') &&
      !response.get('wasReadByRecipient')
    ) {
      response.set('wasReadByRecipient', true);
      response.save();
    }
  },

  displayReply: computed(
    'replyToView',
    'sortedApproverReplies.[]',
    function () {
      if (this.replyToView) {
        return this.replyToView;
      }

      return this.get('sortedApproverReplies.lastObject') || null;
    }
  ),

  isDraft: computed('displayReply.status', function () {
    return this.get('displayReply.status') === 'draft';
  }),

  sortedApproverReplies: computed('approverReplies.[]', function () {
    if (!this.approverReplies) {
      return [];
    }
    return this.approverReplies.rejectBy('isTrashed').sortBy('createDate');
  }),

  showApproverActions: computed(
    'isOwnMentorReply',
    'canApprove',
    'showReplyInput',
    'isEditingApproverReply',
    function () {
      if (
        this.canApprove &&
        !this.isOwnMentorReply &&
        this.isEditingApproverReply
      ) {
        return true;
      } else {
        return (
          this.canApprove && !this.isOwnMentorReply && !this.showReplyInput
        );
      }
    }
  ),

  showNoActionsMessage: computed(
    'responseToApprove.status',
    'showUndoApproval',
    function () {
      return (
        this.get('responseToApprove.status') === 'approved' &&
        !this.showUndoApproval
      );
    }
  ),

  showApprove: computed('responseToApprove.status', function () {
    return (
      this.get('responseToApprove.status') !== 'approved' &&
      this.get('responseToApprove.status') !== 'superceded'
    );
  }),

  showCompose: computed('responseToApprove.status', function () {
    return (
      this.get('responseToApprove.status') !== 'approved' &&
      this.get('responseToApprove.status') !== 'superceded'
    );
  }),

  showUndoApproval: computed(
    'responseToApprove.status',
    'responseToApprove.wasReadByRecipient',
    function () {
      return (
        this.get('responseToApprove.status') === 'approved' &&
        !this.get('responseToApprove.wasReadByRecipient')
      );
    }
  ),

  canEditApproverReply: computed(
    'currentUser.user',
    'isOwnDisplayReply',
    function () {
      if (!this.displayReply) {
        return false;
      }
      return this.get('currentUser.user.isAdmin') || this.isOwnDisplayReply;
    }
  ),
  canReviseApproverReply: computed('isOwnDisplayReply', function () {
    return this.isOwnDisplayReply;
  }),

  showApproverEdit: computed(
    'canEditApproverReply',
    'isRevisingApproverReply',
    'isEditingApproverReply',
    'isFinishingDraft',
    function () {
      return (
        this.canEditApproverReply &&
        !this.isRevisingApproverReply &&
        !this.isEditingApproverReply &&
        !this.isFinishingDraft
      );
    }
  ),

  showApproverRevise: computed(
    'canReviseApproverReply',
    'showReplyInput',
    'isDraft',
    'showCompose',
    function () {
      return (
        this.canReviseApproverReply &&
        !this.isDraft &&
        !this.showReplyInput &&
        this.showCompose
      );
    }
  ),

  showResumeDraft: computed(
    'isOwnDisplayReply',
    'isDraft',
    'showReplyInput',
    function () {
      return this.isOwnDisplayReply && this.isDraft && !this.showReplyInput;
    }
  ),

  isOwnDisplayReply: computed('currentUser.user', 'displayReply', function () {
    return (
      this.get('currentUser.user.id') === this.get('displayReply.createdBy.id')
    );
  }),

  isDisplayReplyToYou: computed(
    'currentUser.user',
    'displayReply.recipient',
    function () {
      let recipientId = this.utils.getBelongsToId(
        this.displayReply,
        'recipient'
      );
      return this.get('currentUser.user.id') === recipientId;
    }
  ),

  showReplyInput: computed(
    'isEditingApproverReply',
    'isRevisingApproverReply',
    'isComposingReply',
    'isFinishingDraft',
    function () {
      return (
        this.isEditingApproverReply ||
        this.isRevisingApproverReply ||
        this.isComposingReply ||
        this.isFinishingDraft
      );
    }
  ),

  showDisplayReplyActions: computed('showReplyInput', function () {
    return !this.showReplyInput;
  }),

  replyHeadingText: computed(
    'isEditingApproverReply',
    'isRevisingApproverReply',
    'isComposingReply',
    function () {
      if (this.isEditingApproverReply) {
        return 'Editing Reply';
      }
      if (this.isRevisingApproverReply) {
        return 'New Revision';
      }
      if (this.isComposingReply) {
        return 'New Reply';
      }
    }
  ),

  canTrash: computed('canApprove', function () {
    return this.canApprove;
  }),
  showTrash: computed('showReplyInput', 'canApprove', function () {
    return this.canApprove && !this.showReplyInput;
  }),

  statusOptions: {
    needsRevisions: 'Needs Revisions',
    approved: 'Approved',
    pendingApproval: 'Pending Approval',
    superceded: 'Superceded',
  },
  getQuillErrors() {
    let errors = [];
    if (this.isQuillEmpty) {
      errors.addObject('emptyReplyError');
    }
    if (this.isQuillTooLong) {
      errors.addObject('quillTooLongError');
    }
    return errors;
  },

  returnSizeDisplay(bytes) {
    if (bytes < 1024) {
      return bytes + ' bytes';
    } else if (bytes >= 1024 && bytes < 1048576) {
      return (bytes / 1024).toFixed(1) + 'KB';
    } else if (bytes >= 1048576) {
      return (bytes / 1048576).toFixed(1) + 'MB';
    }
  },

  quillTooLongErrorMsg: computed(
    'quillText.length',
    'maxResponseLength',
    function () {
      let len = this.get('quillText.length');
      let maxLength = this.maxResponseLength;
      let maxSizeDisplay = this.returnSizeDisplay(maxLength);
      let actualSizeDisplay = this.returnSizeDisplay(len);

      return `The total size of your response (${actualSizeDisplay}) exceeds the maximum limit of ${maxSizeDisplay}. Please remove or resize any large images and try again.`;
    }
  ),

  clearErrorProps() {
    this.removeMessages(this.errorPropsToRemove);
  },

  isOldFormatDisplayResponse: computed('displayReply.text', function () {
    let text = this.get('displayReply.text');
    let parsed = new DOMParser().parseFromString(text, 'text/html');
    return !Array.from(parsed.body.childNodes).some(
      (node) => node.nodeType === 1
    );
  }),

  recipientReadUnreadIcon: computed(
    'displayReply.wasReadByRecipient',
    function () {
      let results = {};
      if (this.get('displayReply.wasReadByRecipient')) {
        results.className = 'far fa-envelope-open';
        results.title = 'Recipient has seen message';
      } else {
        results.className = 'far fa-envelope';
        results.title = 'Recipient has not seen message';
      }
      return results;
    }
  ),

  showRecipientReadUnread: computed(
    'isDisplayReplyToYou',
    'displayReply.status',
    function () {
      return (
        !this.isDisplayReplyToYou && this.get('displayReply.status') !== 'draft'
      );
    }
  ),

  revisionsToolTip: 'Replies are sorted from oldest to newest, left to right.',

  actions: {
    composeReply() {
      this.set('isComposingReply', true);
    },
    stopComposing() {
      this.set('isComposingReply', false);
      this.set('editRevisionText', '');
    },
    cancelReply() {
      let props = [
        'isEditingApproverReply',
        'isRevisingApproverReply',
        'isComposingReply',
        'isFinishingDraft',
      ];
      props.forEach((prop) => {
        if (this.get(prop)) {
          this.set(prop, false);
        }
      });
      this.set('editRevisionText', '');
    },
    editApproverReply() {
      this.set('isEditingApproverReply', true);
      this.set('editRevisionText', this.get('displayReply.text'));
    },
    reviseApproverReply() {
      this.set('isRevisingApproverReply', true);
      this.set('editRevisionText', this.get('displayReply.text'));
    },
    confirmApproval() {
      this.alert
        .showModal(
          'question',
          'Are you sure you want to approve this feedback?',
          'Once approved the intended recipient will be able to view the reply.',
          'Approve'
        )
        .then((result) => {
          if (result.value) {
            this.responseToApprove.set('status', 'approved');
            this.responseToApprove.set('approvedBy', this.currentUser.user);
            return this.responseToApprove.save();
          }
        })
        .then((saved) => {
          if (saved) {
            this.alert.showToast(
              'success',
              'Feedback Approved',
              'bottom-end',
              3000,
              false,
              null
            );
          }
        })
        .catch((err) => {
          this.errorHandling.handleErrors(
            err,
            'approvalErrors',
            this.responseToApprove
          );
        });
    },

    saveReply(newStatus, isDraft) {
      this.clearErrorProps();

      let quillErrors = this.getQuillErrors();
      if (quillErrors.length > 0) {
        quillErrors.forEach((errorProp) => {
          this.set(errorProp, true);
        });
        return;
      }

      let text = this.quillText;

      let trimmed = text.trim();

      let replyStatus = 'approved';
      let toastMessage = 'Reply Sent';

      if (isDraft) {
        replyStatus = 'draft';
        toastMessage = 'Draft Saved';
      }
      let record = this.store.createRecord('response', {
        recipient: this.get('responseToApprove.createdBy.content'),
        createdBy: this.currentUser.user,
        submission: this.submission,
        workspace: this.workspace,
        status: replyStatus,
        responseType: 'approver',
        source: 'submission',
        reviewedResponse: this.responseToApprove || this.reviewedResponse,
        text: trimmed,
      });

      let obj = {
        newReply: record.save(),
      };

      if (!isDraft) {
        this.responseToApprove.set('status', newStatus);
        if (newStatus === 'approved') {
          this.responseToApprove.set('approvedBy', this.currentUser.user);
          record.set('isApproverNoteOnly', true);
        }
        obj.updatedReply = this.responseToApprove.save();
      }

      this.loading.handleLoadingMessage(
        this,
        'start',
        'isReplySending',
        'doShowLoadingMessage'
      );
      return hash(obj)
        .then((obj) => {
          this.loading.handleLoadingMessage(
            this,
            'end',
            'isReplySending',
            'doShowLoadingMessage'
          );
          if (!obj) {
            return;
          }
          this.send('cancelReply');

          this.subResponses.addObject(obj.newReply);
          this.set('replyToView', obj.newReply);
          this.alert.showToast(
            'success',
            toastMessage,
            'bottom-end',
            3000,
            false,
            null
          );
          this.handleResponseThread(obj.newReply, 'approver');
        })
        .catch((err) => {
          this.loading.handleLoadingMessage(
            this,
            'end',
            'isReplySending',
            'doShowLoadingMessage'
          );
          this.errorHandling.handleErrors(err, 'saveRecordErrors', null, [
            record,
            this.responseToApprove,
          ]);
        });
    },
    setReplyToView(response) {
      if (!response || this.get('displayReply.id') === response.get('id')) {
        return;
      }
      [
        'isEditingApproverReply',
        'isRevisingApproverReply',
        'isFinishingDraft',
      ].forEach((prop) => {
        if (this.get(prop)) {
          this.set(prop, false);
        }
      });
      this.handleRecipientRead(response);

      this.set('replyToView', response);
    },

    startEditing() {
      this.set('editRevisionText', this.get('displayReply.text'));
      this.set('editRevisionNote', this.get('displayReply.note'));
      this.set('isEditingApproverReply', true);
    },
    stopEditing() {
      this.set('isEditingApproverReply', false);
      this.set('editRevisionText', '');
      this.set('editRevisionNote', '');
      this.clearErrorProps();
    },
    startRevising() {
      this.set('editRevisionText', this.get('displayReply.text'));
      this.set('editRevisionNote', this.get('displayReply.note'));

      this.set('isRevisingApproverReply', true);
    },
    stopRevising() {
      this.set('isRevisingApproverReply', false);
      this.set('editRevisionText', '');
      this.set('editRevisionNote', '');
      this.clearErrorProps();
    },
    resumeDraft() {
      this.set('editRevisionText', this.get('displayReply.text'));

      this.set('isFinishingDraft', true);
    },

    stopDraft() {
      this.set('isFinishingDraft', false);

      this.set('editRevisionText', '');
      this.set('editRevisionNote', '');

      this.clearErrorProps();
    },

    saveDraft(newStatus) {
      this.clearErrorProps();

      let quillErrors = this.getQuillErrors();
      if (quillErrors.length > 0) {
        quillErrors.forEach((errorProp) => {
          this.set(errorProp, true);
        });
        return;
      }

      let oldMessageBody = this.get('displayReply.text');
      let messageBody = this.quillText;

      // if they clicked Needs Revisions or Approve, there are changes
      if (newStatus === 'draft') {
        if (oldMessageBody === messageBody) {
          this.alert.showToast(
            'info',
            'No changes to save',
            'bottom-end',
            3000,
            false,
            null
          );
          this.set('isFinishingDraft', false);
          this.set('editRevisionText', '');

          return;
        }
      }

      this.displayReply.set('text', messageBody);

      let isDraft = newStatus === 'draft';
      let toastMessage = 'Draft Saved';

      let responseToUpdate;
      if (!isDraft) {
        toastMessage = 'Reply Sent';

        if (this.responseToApprove) {
          responseToUpdate = this.responseToApprove;
        } else {
          let reviewedResponseId = this.utils.getBelongsToId(
            this.displayReply,
            'reviewedResponse'
          );
          let reviewedResponse;

          if (reviewedResponseId) {
            reviewedResponse = this.store.peekRecord(
              'response',
              reviewedResponseId
            );
          }

          responseToUpdate = reviewedResponse;
        }
        if (responseToUpdate) {
          responseToUpdate.set('status', newStatus);
        }

        this.displayReply.set('status', 'approved');
        if (newStatus === 'approved') {
          if (responseToUpdate) {
            responseToUpdate.set('approvedBy', this.currentUser.user);
          }
          this.displayReply.set('isApproverNoteOnly', true);
        }
      }

      let obj = {
        newReply: this.displayReply.save(),
      };

      if (!isDraft && responseToUpdate) {
        obj.updatedResponse = responseToUpdate.save();
      }
      this.loading.handleLoadingMessage(
        this,
        'start',
        'isReplySending',
        'doShowLoadingMessage'
      );

      hash(obj)
        .then((obj) => {
          this.loading.handleLoadingMessage(
            this,
            'end',
            'isReplySending',
            'doShowLoadingMessage'
          );
          this.alert.showToast(
            'success',
            toastMessage,
            'bottom-end',
            3000,
            false,
            null
          );
          this.set('isFinishingDraft', false);
          this.set('editRevisionText', '');
        })
        .catch((err) => {
          this.loading.handleLoadingMessage(
            this,
            'end',
            'isReplySending',
            'doShowLoadingMessage'
          );

          this.errorHandling.handleErrors(
            err,
            'saveRecordErrors',
            this.displayReply
          );
        });
    },

    saveEdit() {
      this.clearErrorProps();

      let quillErrors = this.getQuillErrors();

      if (quillErrors.length > 0) {
        quillErrors.forEach((errorProp) => {
          this.set(errorProp, true);
        });
        return;
      }

      let oldText = this.get('displayReply.text');
      let newText = this.quillText;

      let oldNote = this.get('displayReply.note');
      let newNote = this.editRevisionNote;

      if (oldText === newText && oldNote === newNote) {
        this.alert.showToast(
          'info',
          'No changes to save',
          'bottom-end',
          3000,
          false,
          null
        );
        this.set('isEditingApproverReply', false);
        return;
      }

      this.displayReply.set('text', newText);
      this.displayReply.set('note', newNote);

      this.loading.handleLoadingMessage(
        this,
        'start',
        'isReplySending',
        'doShowLoadingMessage'
      );

      this.displayReply
        .save()
        .then((saved) => {
          this.loading.handleLoadingMessage(
            this,
            'end',
            'isReplySending',
            'doShowLoadingMessage'
          );
          this.alert.showToast(
            'success',
            'Response Updated',
            'bottom-end',
            3000,
            false,
            null
          );
          this.set('isEditingApproverReply', false);
          this.set('editRevisionText', '');
        })
        .catch((err) => {
          this.loading.handleLoadingMessage(
            this,
            'end',
            'isReplySending',
            'doShowLoadingMessage'
          );
          this.errorHandling.handleErrors(
            err,
            'saveRecordErrors',
            this.displayReply
          );
        });
    },

    saveRevision() {
      this.clearErrorProps();

      let quillErrors = this.getQuillErrors();

      if (quillErrors.length > 0) {
        quillErrors.forEach((errorProp) => {
          this.set(errorProp, true);
        });
        return;
      }

      let oldText = this.get('displayReply.text');
      let newText = this.quillText;

      let oldNote = this.get('displayReply.note');
      let newNote = this.editRevisionNote;

      if (oldText === newText && oldNote === newNote) {
        this.alert.showToast(
          'info',
          'No changes to save',
          'bottom-end',
          3000,
          false,
          null
        );

        this.set('isRevisingApproverReply', false);
        return;
      }

      let copy = this.displayReply.toJSON({ includeId: false });
      delete copy.approvedBy;
      delete copy.lastModifiedDate;
      delete copy.lastModifiedBy;
      delete copy.wasReadByRecipient;
      delete copy.wasReadByApprover;

      copy.text = newText;
      copy.note = newNote;

      copy.createDate = new Date();
      let revision = this.store.createRecord('response', copy);
      revision.set('createdBy', this.currentUser.user);
      revision.set('submission', this.get('displayReply.submission'));
      revision.set('workspace', this.get('displayReply.workspace'));
      revision.set('priorRevision', this.displayReply);
      revision.set('recipient', this.get('displayReply.recipient.content'));
      revision.set(
        'reviewedResponse',
        this.reviewedResponses || this.responseToApprove
      );

      this.loading.handleLoadingMessage(
        this,
        'start',
        'isReplySending',
        'doShowLoadingMessage'
      );
      revision
        .save()
        .then((saved) => {
          this.loading.handleLoadingMessage(
            this,
            'end',
            'isReplySending',
            'doShowLoadingMessage'
          );

          this.alert.showToast(
            'success',
            'Revision Sent',
            'bottom-end',
            3000,
            false,
            null
          );
          this.set('isRevisingApproverReply', false);
          this.set('editRevisionText', '');
          this.subResponses.addObject(saved);
          this.handleResponseThread(saved, 'approver');
        })
        .catch((err) => {
          this.loading.handleLoadingMessage(
            this,
            'end',
            'isReplySending',
            'doShowLoadingMessage'
          );
          this.errorHandling.handleErrors(err, 'saveRecordErrors', revision);
        });
    },
    confirmTrash(response) {
      if (!response) {
        return;
      }

      return this.alert
        .showModal(
          'warning',
          'Are you sure you want to delete this response?',
          '',
          'Delete'
        )
        .then((result) => {
          if (result.value) {
            response.set('isTrashed', true);
            return response.save();
          }
        })
        .then((saved) => {
          if (saved) {
            this.alert.showToast(
              'success',
              'Response Deleted',
              'bottom-end',
              3000,
              false,
              null
            );
            this.set('replyToView', null);
          }
        })
        .catch((err) => {
          this.errorHandling.handleErrors(err, 'recordSaveErrors', response);
        });
    },
    updateQuillText(content, isEmpty, isOverLengthLimit) {
      this.set('quillText', content);
      this.set('isQuillEmpty', isEmpty);
      this.set('isQuillTooLong', isOverLengthLimit);
    },
    undoApproval() {
      this.alert
        .showModal(
          'question',
          'Are you sure you want to unapprove this mentor reply?',
          'The new status will be "Pending Approval"',
          'Unapprove'
        )
        .then((result) => {
          if (result.value) {
            this.responseToApprove.set('status', 'pendingApproval');
            this.responseToApprove.set('approvedBy', null);
            this.responseToApprove.set('unapprovedBy', this.currentUser.user);

            return this.responseToApprove.save();
          }
        })
        .then((saved) => {
          if (saved) {
            this.alert.showToast(
              'success',
              'Feedback Unapproved',
              'bottom-end',
              3000,
              false,
              null
            );
          }
        })
        .catch((err) => {
          this.displayErrorToast(err, this.responseToApprove);
        });
    },
  },
});

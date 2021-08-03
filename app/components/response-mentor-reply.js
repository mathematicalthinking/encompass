import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import CurrentUserMixin from '../mixins/current_user_mixin';
import ErrorHandlingMixin from '../mixins/error_handling_mixin';

export default Component.extend(CurrentUserMixin, ErrorHandlingMixin, {
  elementId: 'response-mentor-reply',
  alert: service('sweet-alert'),
  utils: service('utility-methods'),
  loading: service('loading-display'),

  isRevising: false,
  isFinishingDraft: false,

  currentDisplayResponseId: null,
  quillEditorId: 'mentor-editor',
  quillText: '',
  maxResponseLength: 14680064,

  errorPropsToRemove: [
    'saveRecordErrors',
    'emptyReplyError',
    'quillTooLongError',
  ],

  didReceiveAttrs() {
    if (this.displayResponse.id !== this.currentDisplayResponseId) {
      this.set('currentDisplayResponseId', this.displayResponse.id);

      ['isEditing', 'isRevising', 'isFinishingDraft'].forEach((prop) => {
        if (this.get(prop)) {
          this.set(prop, false);
        }
      });
    }
    this._super(...arguments);
  },

  statusIconFill: computed('displayResponse.status', function () {
    let status = this.displayResponse.status;
    return this.iconFillOptions[status];
  }),

  showStatus: computed('canApprove', 'isOwnMentorReply', function () {
    return this.canApprove || this.isOwnMentorReply;
  }),

  newReplyStatus: computed('canDirectSend', function () {
    if (this.canDirectSend) {
      return 'approved';
    }
    return 'pendingApproval';
  }),

  canRevise: computed('isOwnMentorReply', 'isParentWorkspace', function () {
    return !this.isParentWorkspace && this.isOwnMentorReply;
  }),

  canEdit: computed(
    'canApprove',
    'displayResponse.status',
    'isOwnMentorReply',
    'isParentWorkspace',
    function () {
      return (
        !this.isParentWorkspace &&
        this.displayResponse.status === 'pendingApproval' &&
        (this.canApprove || this.isOwnMentorReply)
      );
    }
  ),

  isComposing: computed(
    'isEditing',
    'isRevising',
    'isFinishingDraft',
    function () {
      return this.isEditing || this.isRevising || this.isFinishingDraft;
    }
  ),

  showEdit: computed('canEdit', 'isComposing', function () {
    return this.canEdit && !this.isComposing;
  }),

  isDraft: computed('displayResponse.status', function () {
    return this.displayResponse.status === 'draft';
  }),

  showRevise: computed('canRevise', 'isComposing', 'isDraft', function () {
    return this.canRevise && !this.isDraft && !this.isComposing;
  }),

  showResumeDraft: computed(
    'isOwnMentorReply',
    'isDraft',
    'isComposing',
    function () {
      return this.isOwnMentorReply && this.isDraft && !this.isComposing;
    }
  ),

  responseNewModel: computed(
    'isCreating',
    'response',
    'displayResponse',
    function () {
      if (this.isCreating) {
        return this.response;
      }
      return this.displayResponse;
    }
  ),

  replyHeadingText: computed('isEditing', 'isRevising', function () {
    if (this.isEditing) {
      return 'Editing Mentor Reply';
    }
    if (this.isRevising) {
      return 'New Revision';
    }
  }),

  showApproverNoteInput: computed('newReplyStatus', 'isComposing', function () {
    return this.isComposing && this.newReplyStatus !== 'approved';
  }),

  sortedMentorReplies: computed('mentorReplies.@each.isTrashed', function () {
    if (!this.mentorReplies) {
      return [];
    }
    return this.mentorReplies.rejectBy('isTrashed').sortBy('createDate');
  }),

  showNoteHeader: computed(
    'showApproverNoteInput',
    'showDisplayNote',
    function () {
      return this.showApproverNoteInput || this.showDisplayNote;
    }
  ),

  showDisplayNote: computed(
    'displayResponse.note',
    'isOwnMentorReply',
    'canApprove',
    'isComposing',
    function () {
      if (this.isComposing) {
        return false;
      }

      if (!this.isOwnMentorReply && !this.canApprove) {
        return false;
      }

      let note = this.displayResponse.note;
      return typeof note === 'string' && note.length > 0;
    }
  ),

  canTrash: computed(
    'isOwnMentorReply',
    'canApprove',
    'displayResponse.status',
    'isParentWorkspace',
    function () {
      let status = this.displayResponse.status;

      if (this.isParentWorkspace) {
        return false;
      }
      return (
        status === 'draft' ||
        (status === 'pendingApproval' &&
          (this.isOwnMentorReply || this.canApprove))
      );
    }
  ),
  showTrash: computed('canTrash', 'isComposing', function () {
    return this.canTrash && !this.isComposing;
  }),
  canSendNew: computed(
    'canSend',
    'isOwnSubmission',
    'isParentWorkspace',
    function () {
      return !this.isParentWorkspace && this.canSend && !this.isOwnSubmission;
    }
  ),

  sendButtonText: computed('canDirectSend', function () {
    if (this.canDirectSend) {
      return 'Send';
    }
    return 'Submit for Approval';
  }),

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
      let len = this.quillText.length;
      let maxLength = this.maxResponseLength;
      let maxSizeDisplay = this.returnSizeDisplay(maxLength);
      let actualSizeDisplay = this.returnSizeDisplay(len);

      return `The total size of your response (${actualSizeDisplay}) exceeds the maximum limit of ${maxSizeDisplay}. Please remove or resize any large images and try again.`;
    }
  ),

  clearErrorProps() {
    this.removeMessages(this.errorPropsToRemove);
  },

  isOldFormatDisplayResponse: computed('displayResponse.text', function () {
    let text = this.displayResponse.text;
    let parsed = new DOMParser().parseFromString(text, 'text/html');
    return !Array.from(parsed.body.childNodes).some(
      (node) => node.nodeType === 1
    );
  }),

  recipientReadUnreadIcon: computed(
    'displayResponse.wasReadByRecipient',
    function () {
      let results = {};
      if (this.displayResponse.wasReadByRecipient) {
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
    'isMentorRecipient',
    'displayResponse.status',
    function () {
      let status = this.displayResponse.status;

      return status === 'approved' && !this.isMentorRecipient;
    }
  ),

  revisionsToolTip: 'Replies are sorted from oldest to newest, left to right.',

  actions: {
    onSaveSuccess(submission, response) {
      this.onSaveSuccess(submission, response);
    },

    // value true or false
    handleComposeAction(propName, value, doClearErrors) {
      if (value) {
        this.set('editRevisionText', this.displayResponse.text);
        this.set('editRevisionNote', this.displayResponse.note);
      } else {
        this.set('editRevisionText', '');
        this.set('editRevisionNote', '');
      }

      this.set(propName, value);

      if (doClearErrors) {
        this.clearErrorProps();
      }
    },

    saveDraft(isDraft) {
      this.clearErrorProps();

      let quillErrors = this.getQuillErrors();

      if (quillErrors.length > 0) {
        quillErrors.forEach((errorProp) => {
          this.set(errorProp, true);
        });
        return;
      }
      let messageBody = this.quillText;

      let approverNote = this.editRevisionNote;

      this.displayResponse.set('text', messageBody);
      this.displayResponse.set('note', approverNote);

      let doSetSuperceded = false;

      let priorRevisionStatus = this.priorMentorRevision.status;
      if (
        priorRevisionStatus === 'pendingApproval' ||
        priorRevisionStatus === 'needsRevisions'
      ) {
        doSetSuperceded = true;
        this.priorMentorRevision.set('status', 'superceded');
      }

      let newStatus = this.newReplyStatus;
      let toastMessage = 'Response Sent';

      if (newStatus === 'pendingApproval') {
        toastMessage = 'Response Sent for Approval';
      }
      if (isDraft) {
        newStatus = 'draft';
        toastMessage = 'Draft Saved';
      }

      this.displayResponse.set('status', newStatus);

      let hash = {
        newResponse: this.displayResponse.save(),
      };
      if (doSetSuperceded) {
        hash.priorRevision = this.priorMentorRevision.save();
      }
      this.loading.handleLoadingMessage(
        this,
        'start',
        'isReplySending',
        'doShowLoadingMessage'
      );

      hash(hash)
        .then((hash) => {
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

          this.handleErrors(err, 'saveRecordErrors', this.displayResponse);
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

      let oldText = this.displayResponse.text;
      let newText = this.quillText;

      let oldNote = this.displayResponse.note;
      let newNote = this.editRevisionNote;

      if (oldText === newText && oldNote === newNote) {
        this.set('isEditing', false);
        return;
      }

      this.displayResponse.set('text', newText);
      this.displayResponse.set('note', newNote);

      this.loading.handleLoadingMessage(
        this,
        'start',
        'isReplySending',
        'doShowLoadingMessage'
      );

      this.displayResponse
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
          this.set('isEditing', false);
          this.set('editRevisionText', '');
        })
        .catch((err) => {
          this.loading.handleLoadingMessage(
            this,
            'end',
            'isReplySending',
            'doShowLoadingMessage'
          );

          this.handleErrors(err, 'saveRecordErrors');
        });
    },

    saveRevision(isDraft) {
      this.clearErrorProps();

      let quillErrors = this.getQuillErrors();

      if (quillErrors.length > 0) {
        quillErrors.forEach((errorProp) => {
          this.set(errorProp, true);
        });
        return;
      }

      let oldText = this.displayResponse.text;
      let newText = this.quillText;

      let oldNote = this.displayResponse.note;
      let newNote = this.editRevisionNote;

      if (!isDraft) {
        if (oldText === newText && oldNote === newNote) {
          this.set('isRevising', false);
          return;
        }
      }

      let oldStatus = this.displayResponse.status;
      let doSetSuperceded =
        !isDraft &&
        (oldStatus === 'pendingApproval' || oldStatus === 'needsRevisions');

      let copy = this.displayResponse.toJSON({ includeId: false });
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

      let newReplyStatus = this.newReplyStatus;

      if (isDraft) {
        newReplyStatus = 'draft';
      }

      let revision = this.store.createRecord('response', copy);
      revision.set('createdBy', this.currentUser);
      revision.set('submission', this.submission);
      revision.set('workspace', this.workspace);
      revision.set('priorRevision', this.displayResponse);
      revision.set('recipient', this.displayResponse.recipient.content);
      revision.set('status', newReplyStatus);

      let hash;
      let toastMessage = 'Revision Sent';

      if (isDraft) {
        toastMessage = 'Draft Saved';
      }

      if (doSetSuperceded) {
        this.displayResponse.set('status', 'superceded');

        hash = {
          revision: revision.save(),
          original: this.displayResponse.save(),
        };
      } else {
        hash = {
          revision: revision.save(),
        };
      }

      this.loading.handleLoadingMessage(
        this,
        'start',
        'isReplySending',
        'doShowLoadingMessage'
      );

      hash(hash)
        .then((hash) => {
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
          this.set('isRevising', false);
          this.set('editRevisionText', '');
          this.send('setDisplayMentorReply', hash.revision);

          // look for responseThread to add response to
          this.handleResponseThread(hash.revision, 'mentor');
        })
        .catch((err) => {
          this.loading.handleLoadingMessage(
            this,
            'end',
            'isReplySending',
            'doShowLoadingMessage'
          );

          this.handleErrors(err, 'saveRecordErrors', null, [
            revision,
            this.displayResponse,
          ]);
        });
    },
    setDisplayMentorReply(response) {
      if (!response) {
        return;
      }

      this.onMentorReplySwitch(response);
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

            let prevResponse = this.sortedMentorReplies.lastObject || null;
            this.onSaveSuccess(this.submission, prevResponse);
          }
        })
        .catch((err) => {
          this.handleErrors(err, 'recordSaveErrors', response);
        });
    },
    toNewResponse: function () {
      this.toNewResponse();
    },
    handleNewMentorReply(response, threadType) {
      this.handleResponseThread(response, threadType);
    },
    updateQuillText(content, isEmpty, isOverLengthLimit) {
      this.set('quillText', content);
      this.set('isQuillEmpty', isEmpty);
      this.set('isQuillTooLong', isOverLengthLimit);
    },
  },
});

import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

const BUTTON_CONFIG = {
  approved: [],
  draft: [
    { action: 'handleResumeDraft', text: 'Resume Draft' },
    { action: 'handleTrash', text: 'Trash', isTrash: true },
  ],
  superceded: [],
  trashed: [],
  pendingApproval: [],
  needsRevisions: [
    { action: 'handleRevise', text: 'Revise' },
    { action: 'handleTrash', text: 'Trash', isTrash: true },
  ],
  composingDirect: [
    { action: 'handleSend', text: 'Send' },
    { action: 'handleSaveAsDraft', text: 'Save as Draft' },
    { action: 'handleCancel', text: 'Cancel', isCancel: true },
  ],
  composingApproval: [
    { action: 'handleSend', text: 'Submit for Approval' },
    { action: 'handleSaveAsDraft', text: 'Save as Draft' },
    { action: 'handleCancel', text: 'Cancel', isCancel: true },
  ],
};

const STATUS_TEXT = {
  approved: 'Approved',
  draft: 'Draft',
  pendingApproval: 'Pending Approval',
  needsRevisions: 'Needs Revisions',
  superceded: 'Superceded',
  trashed: 'Trashed', // just for completeness
};

export default class ResponseMentorSingleReply extends Component {
  @service instanceTracker;
  @service('loading-display') loading;
  @service('sweet-alert') alert;
  @service currentUser;
  @service quillManager;
  @service errorHandling;
  @service store;

  @tracked text = this.args.mentorReply.text;
  @tracked isEmpty = false;
  @tracked isOverflow = false;

  get status() {
    if (this.args.mentorReply.isTrashed) return 'trashed';
    if (this.isEditing) {
      return this.args.canDirectSend ? 'composingDirect' : 'composingApproval';
    }
    return this.args.mentorReply.status;
  }

  get statusText() {
    return STATUS_TEXT[this.args.mentorReply.status] || 'unknown';
  }

  get isEditing() {
    return (
      this.instanceTracker.getCurrentInstance(this.args.quillEditorId) ===
      this.args.mentorReply
    );
  }

  get otherBeingEdited() {
    return !this.isEditing && this.args.replyBeingEdited;
  }

  get actionButtons() {
    return BUTTON_CONFIG[this.status] || [];
  }

  get showContentHighlight() {
    return (
      this.status === 'pendingApproval' || this.status === 'needsRevisions'
    );
  }

  // Don't show the reply at all if it has been trashed or superceded by another reply.
  get showReply() {
    return this.status !== 'trashed' && this.status !== 'superceded';
  }

  // show the action buttons if there are buttons to show and the user isn't editng another reply
  get showButtons() {
    return this.actionButtons.length > 0 && !this.otherBeingEdited;
  }

  get recipientReadUnreadIcon() {
    if (this.args.mentorReply.wasReadByRecipient) {
      return {
        className: 'far fa-envelope-open',
        title: 'Recipient has seen message',
      };
    } else {
      return {
        className: 'far fa-envelope',
        title: 'Recipient has not seen message',
      };
    }
  }

  get showRecipientReadUnread() {
    const status = this.args.mentorReply.status;
    return status === 'approved' && !this.args.isMentorRecipient;
  }

  get isOldFormatDisplayResponse() {
    let text = this.args.mentorReply.text;
    let parsed = new DOMParser().parseFromString(text, 'text/html');
    return !Array.from(parsed.body.childNodes).some(
      (node) => node.nodeType === Node.ELEMENT_NODE
    );
  }

  get newReplyStatus() {
    return this.args.canDirectSend ? 'approved' : 'pendingApproval';
  }

  @action
  saveDraft(isDraft) {
    // handle quill errors; exit if errors --- DONE
    // get the text and notes

    const reply = this.args.mentorReply;

    reply.text = this.quillManager.getHtml(this.args.quillEditorId);

    // adjust the prior response status and save
    const priorMentorRevision = this.args.priorMentorRevision;
    const priorRevisionStatus = priorMentorRevision?.status;

    const promises = [];
    if (
      priorRevisionStatus === 'pendingApproval' ||
      priorRevisionStatus === 'needsRevisions'
    ) {
      priorMentorRevision.status = 'superceded';
      promises.push(priorMentorRevision.save());
    }

    // adjust the mentorResponse status and save

    let newStatus, toastMessage;
    if (isDraft) {
      newStatus = 'draft';
      toastMessage = 'Draft Saved';
    } else {
      newStatus = this.newReplyStatus;
      toastMessage =
        newStatus === 'pendingApproval'
          ? 'Response Sent for Approval'
          : 'Response Sent';
    }

    reply.status = newStatus;
    promises.push(reply.save());

    // execute the promises -- loading, errors, and other actions

    this.loading.handleLoadingMessage(
      this,
      'start',
      'isReplySending',
      'doShowLoadingMessage'
    );

    Promise.all(promises)
      .then(() => {
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
          this.displayResponse
        );
      });
  }

  @action
  onTextChanged(html, isEmpty, isOverflow) {
    this.quillManager.onEditorChange(
      this.args.quillEditorId,
      html,
      isEmpty,
      isOverflow
    );
  }

  @action
  handleAction(actionName) {
    switch (actionName) {
      case 'handleTrash':
        this.args.confirmTrash(this.args.mentorReply);
        break;
      case 'handleResumeDraft':
      case 'handleRevise':
        this.instanceTracker.setCurrentInstance(
          this.args.mentorReply,
          this.args.quillEditorId
        );
        break;
      case 'handleCancel':
        this.instanceTracker.clearCurrentInstance(this.args.quillEditorId);
        break;
      case 'handleSaveAsDraft':
        this.saveDraft(true);
        this.instanceTracker.clearCurrentInstance(this.args.quillEditorId);
        break;
      case 'handleSend':
        this.args.updateQuillText(this.text, this.isEmpty, this.isOverflow);
        //something here
        break;
    }
  }
}

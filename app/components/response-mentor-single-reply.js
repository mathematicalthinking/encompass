import Component from '@glimmer/component';
import { action } from '@ember/object';

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
    return this.args.replyBeingEdited === this.args.mentorReply;
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

  @action
  handleAction(actionName) {
    switch (actionName) {
      case 'handleTrash':
        this.args.confirmTrash(this.args.mentorReply);
        break;
      case 'handleResumeDraft':
      case 'handleRevise':
        this.args.setReplyBeingEdited(this.args.mentorReply);
        break;
      case 'handleCancel':
        this.args.setReplyBeingEdited(null);
        break;
      case 'handleSaveAsDraft':
        this.args.saveDraft(true);
        break;
    }
  }
}

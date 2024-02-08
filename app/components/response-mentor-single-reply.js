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

export default class ResponseMentorSingleReply extends Component {
  get status() {
    if (this.args.mentorReply.isTrashed) return 'trashed';
    if (this.isEditing)
      return this.args.canSendDirect ? 'composingDirect' : 'composingApproval';
    return this.args.mentorReply.status;
  }

  get isEditing() {
    return this.args.replyBeingEdited === this;
  }

  get otherBeingEdited() {
    return !this.isEditing && this.args.replyBeingEdited;
  }

  get buttons() {
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
    return this.buttons.length > 0 && !this.otherBeingEdited;
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
    if (actionName === 'handleTrash') {
      this.args.confirmTrash(this.args.mentorReply);
    } else if (actionName === 'handleResumeDraft' && !this.otherBeingEdited) {
      // buttons should be disabled if another reply is being edited. Above condition JIC
      this.args.setReplyBeingEdited(this);
    } else if (actionName === 'handleRevise' && !this.otherBeingEdited) {
      // buttons should be disabled if another reply is being edited. Above condition JIC
      this.args.setReplyBeingEdited(this);
    } else if (actionName === 'handleCancel') {
      this.args.setReplyBeingEdited(null);
    } else if (actionName === 'handleSaveAsDraft') {
      this.args.saveDraft(true);
    }
  }
}

import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

/*

Responses can have the following status:
* Draft - a response for which the user clicked on Save as Draft
* Needs Revision - a response sent for approval that the approver has tagged as needing revision
* Pending Approval - a response sent for approval that hasn't yet been handled by the approver
* Superseded - the original version of a response that has been revised (or otherwise edited?)
* Approved - a response that has either been approved by an approver or sent to a student for a mentor 
             that doesn't need approval
* Trashed - a response that was deleted

Here are the actions that a mentor can do based on the different status of a response. 
Note that sending for approval vs directly to a student depends on whether the mentor must have responses approved.
* Draft - "Resume". A resumed response can either be sent to a student, sent for approval, or saved as a draft.
* Needs Revision - "Revise". As above for draft, but when the response is sent, we save a "superseded" copy.
* Pending Approval - "Edit." As above for needs revision, but you cannot save as draft.
* Superseded - No mentor actions. These appear only to the mentor who created them.
* Approved - No mentor actions.
* Trashed - does not appear to the mentor; just in the db for researchers.
* (New) - A new response can either be sent to a student, sent for approval, or saved as a draft.

Who should be able to see the responses based on their state:
* Draft - only the person who did the drafting
* Needs Revision -- the person who submitted the response and the approver
* Pending Approval -- same as needs revision
* Superseded - Only the mentor who wrote it
* Approved - everyone
* Trashed - no one (i.e., just researchers)

*/

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

  get showReply() {
    switch (this.status) {
      case 'trashed':
        return false;
      case 'draft':
      case 'superseded':
      case 'pendingApproval':
      case 'needsRevision':
        return this.wasCreatedByMe;
      default:
        return true;
    }
  }

  get wasCreatedByMe() {
    return (
      this.args.mentorReply.createdBy.get('id') ===
      this.currentUser.user.get('id')
    );
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

  // When user is editing a "needs revision" response
  @action
  saveRevision(isDraft) {
    // NOTE: I don't see where saveRevision gets done either.
    // isRevising seems important only in response-submission-view.
    // I can see if the state is 'needsRevisions'. In that case
    // we should be showing the Revise button and then saveRevision
    // would be important. If it's a draft, it can't be needsRevision
    // because the approver wouldn't see it as a draft.
    // handle quill errors --- DONE
    // pull out text and note
    // if not previously a draft and no changes, exit
    // decide whether there is any superceding
    // make a copy of the current response, clearing out key properties
    // set the text and note to the quill
    // set the date and the status
    // create a new record from the copy
    // do the saving (promises)
    // execute the promises
    // post-promise actions

    const reply = this.args.mentorReply;

    let oldText = reply?.text;
    let newText = this.quillManager.getHtml(this.args.quillEditorId);

    let oldNote = reply?.note;
    let newNote = this.args.editRevisionNote;

    if (oldText === newText && oldNote === newNote) return;

    let oldStatus = this.get('displayResponse.status');
    let doSetSuperceded =
      !isDraft &&
      (oldStatus === 'pendingApproval' || oldStatus === 'needsRevisions');

    let copy = reply.toJSON({ includeId: false });
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
    revision.set('createdBy', this.currentUser.user);
    revision.set('submission', this.submission);
    revision.set('workspace', this.workspace);
    revision.set('priorRevision', reply);
    revision.set('recipient', reply?.recipient?.content);
    revision.set('status', newReplyStatus);

    const promises = [revision.save()];
    let toastMessage = 'Revision Sent';

    if (isDraft) {
      toastMessage = 'Draft Saved';
    }

    if (doSetSuperceded) {
      reply.status = 'superceded';
      promises.push(reply.save());
    }

    this.processPromises(promises, toastMessage, [revision, reply], () =>
      this.args.handleResponseThread(revision, 'mentor')
    );
  }

  // @TODO at some point, need to refactor response-new. Should
  // be able to just use response-mentor-single-reply with
  // appropriate configuration.

  // When the user is editing a draft
  @action
  saveDraft(isDraft) {
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
    this.processPromises(promises, toastMessage, [reply]);
  }

  // WHen a user is editing a pendingResponse response
  saveEdit() {
    const reply = this.args.mentorReply;

    let oldText = reply?.text;
    let newText = this.quillManager.getHtml(this.args.quillEditorId);

    let oldNote = reply?.note;
    let newNote = this.args.editRevisionNote;

    if (oldText === newText && oldNote === newNote) return;

    reply.text = newText;
    reply.note = newNote;

    this.processPromises([reply.save()], 'Response Updated');
  }

  processPromises(
    promises,
    toastMessage,
    recordsToRollback = [],
    successActions
  ) {
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

        if (successActions) successActions();
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
          null,
          recordsToRollback
        );
      });
  }

  @action
  onTextChanged(html, isEmpty, isOverflow) {}

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
        if (this.quillManager.hasErrors(this.args.quillEditorId)) return;
        this.saveDraft(true);
        this.instanceTracker.clearCurrentInstance(this.args.quillEditorId);
        break;
      case 'handleSend':
        if (this.quillManager.hasErrors(this.args.quillEditorId)) return;
        this.args.updateQuillText(this.text, this.isEmpty, this.isOverflow);
        //something here
        break;
    }
  }
}

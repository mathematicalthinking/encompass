import { attr, belongsTo, hasMany } from '@ember-data/model';
import AuditableModel from './auditable';
export default class ResponseModel extends AuditableModel {
  get persisted() {
    return !!this.id;
  }
  @attr('string') text;

  // the original response the user was given (should be based on the selections and comments below)
  @attr('string') original;
  // who the response is for
  @belongsTo('user', { inverse: null, async: true }) recipient;
  // where did this response originate from?
  @attr('string') source; //submission, folder, workspace
  @belongsTo('submission', { async: true }) submission; //if available
  @belongsTo('workspace', { async: true }) workspace; //if available
  // the selections and comments originally used
  @hasMany('selection', { async: true }) selections;
  @hasMany('comment', { async: true }) comments;
  get student() {
    return this.submission.get('student');
  }
  get powId() {
    return this.submission.powId;
  }
  get isStatic() {
    return this.submission.isStatic;
  }
  @attr('string') responseType;
  @attr('string') note;
  @attr('string') status;
  @belongsTo('response', { inverse: null, async: true }) priorRevision; // objectId of mentor reply that was revised in response to approve reply
  @belongsTo('response', { inverse: null, async: true }) reviewedResponse; // objectId of the mentor response that was source of approver reply
  @belongsTo('user', { inverse: null, async: true }) approvedBy;
  @attr('boolean', { defaultValue: false }) wasReadByRecipient;
  @attr('boolean', { defaultValue: false }) wasReadByApprover;
  @attr('boolean', { defaultValue: false }) isApproverNoteOnly;
  @belongsTo('user', { inverse: null, async: true }) unapprovedBy;
  @belongsTo('response', { inverse: null, async: true }) originalResponse;
  get shortText() {
    if (typeof this.text !== 'string') {
      return '';
    }
    return this.text.slice(0, 100);
  }
}

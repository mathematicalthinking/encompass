import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import Auditable from '../models/_auditable_mixin';

export default class ResponseModel extends Model.extend(Auditable) {
  get persisted() {
    return !!this.id;
  }
  @attr('string') text;
  // the original response the user was given (should be based on the selections and comments below)
  @attr('string') original;
  // who the response is for
  @belongsTo('user', { inverse: null }) recipient;
  // where did this response originate from?
  @attr('string') source; //submission, folder, workspace
  @belongsTo('submission', { async: true }) submission; //if available
  @belongsTo('workspace') workspace; //if available
  // the selections and comments originally used
  @hasMany('selection', { async: true }) selections;
  @hasMany('comment', { async: true }) comments;
  get student() {
    return this.submission.get('student');
  }
  get powId() {
    return this.submission.powId;
  }
  get isStatc() {
    return this.submiission.isStatic;
  }
  @attr('string') responseType;
  @attr('string') note;
  @attr('string') status;
  @belongsTo('response', { inverse: null }) priorRevision; // objectId of mentor reply that was revised in response to approve reply
  @belongsTo('response', { inverse: null }) reviewedResponse; // objectId of the mentor response that was source of approver reply
  @belongsTo('user', { inverse: null }) approvedBy;
  @attr('boolean', { defaultValue: false }) wasReadByRecipient;
  @attr('boolean', { defaultValue: false }) wasReadByApprover;
  @attr('boolean', { defaultValue: false }) isApproverNoteOnly;
  @belongsTo('user', { invers: null }) unapprovedBy;
  @belongsTo('response', { inverse: null }) originalResponse;
  get shortText() {
    if (typeof this.text !== 'string') {
      return '';
    }
    return this.text.slice(0, 100);
  }
}

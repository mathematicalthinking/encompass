import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { computed } from '@ember/object';
import { alias, bool } from '@ember/object/computed';
import Auditable from '../models/_auditable_mixin';

export default Model.extend(Auditable, {
  persisted: bool('id'),
  text: attr('string'),
  // the original response the user was given (should be based on the selections and comments below)
  original: attr('string'),
  // who the response is for
  recipient: belongsTo('user', { inverse: null }),
  // where did this response originate from?
  source: attr('string'), //submission, folder, workspace
  submission: belongsTo('submission', { async: true }), //if available
  workspace: belongsTo('workspace'), //if available
  // the selections and comments originally used
  selections: hasMany('selection', { async: true }),
  comments: hasMany('comment', { async: true }),
  student: alias('submission.student'),
  powId: alias('submission.powId'),
  isStatic: alias('submission.isStatic'),
  responseType: attr('string'),
  note: attr('string'),
  status: attr('string'),
  priorRevision: belongsTo('response', { inverse: null }), // objectId of mentor reply that was revised in response to approve reply
  reviewedResponse: belongsTo('response', { inverse: null }), // objectId of the mentor response that was source of approver reply
  approvedBy: belongsTo('user', { inverse: null }),
  wasReadByRecipient: attr('boolean', { defaultValue: false }),
  wasReadByApprover: attr('boolean', { defaultValue: false }),
  isApproverNoteOnly: attr('boolean', { defaultValue: false }),
  unapprovedBy: belongsTo('user', { invers: null }),
  originalResponse: belongsTo('response', { inverse: null }),
  shortText: computed('text', function () {
    if (typeof this.text !== 'string') {
      return '';
    }
    return this.text.slice(0, 100);
  }),
});

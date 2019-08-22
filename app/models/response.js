Encompass.Response = DS.Model.extend(Encompass.Auditable, {
  persisted:  Ember.computed.bool('id'),
  text:       DS.attr('string'),
  // the original response the user was given (should be based on the selections and comments below)
  original:   DS.attr('string'),
  // who the response is for
  recipient: DS.belongsTo('user', { inverse: null }),
  // where did this response originate from?
  source:     DS.attr('string'), //submission, folder, workspace
  submission: DS.belongsTo('submission', {async: true}), //if available
  workspace:  DS.belongsTo('workspace'),  //if available
  // the selections and comments originally used
  selections: DS.hasMany('selection', {async: true}),
  comments:   DS.hasMany('comment', {async: true}),
  student:    Ember.computed.alias('submission.student'),
  powId:      Ember.computed.alias('submission.powId'),
  isStatic:   Ember.computed.alias('submission.isStatic'),
  responseType: DS.attr('string'),
  note: DS.attr('string'),
  status: DS.attr('string'),
  priorRevision: DS.belongsTo('response', { inverse: null }), // objectId of mentor reply that was revised in response to approve reply
  reviewedResponse: DS.belongsTo('response', { inverse: null }), // objectId of the mentor response that was source of approver reply
  approvedBy: DS.belongsTo('user', {inverse: null}),
  wasReadByRecipient: DS.attr('boolean', { defaultValue: false }),
  wasReadByApprover: DS.attr('boolean', { defaultValue: false }),
  isApproverNoteOnly: DS.attr('boolean', { defaultValue: false}),
  unapprovedBy: DS.belongsTo('user', { invers: null }),
  originalResponse: DS.belongsTo('response', {inverse: null}),
  shortText: function() {
    if (typeof this.get('text') !== 'string') {
      return '';
    }
    return this.get('text').slice(0, 100);
  }.property('text'),
});

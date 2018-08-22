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
  isStatic:   Ember.computed.alias('submission.isStatic')
});

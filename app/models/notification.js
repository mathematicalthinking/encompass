Encompass.Notification = DS.Model.extend(Encompass.Auditable, {
  text: DS.attr('string'),
  primaryRecordType: DS.attr('string'),
  notificationType: DS.attr('string'),
  oldSubmission: DS.belongsTo('submission', { inverse: null }),
  newSubmission: DS.belongsTo('submission', {inverse: null} ),
  workspace: DS.belongsTo('workspace', {inverse: null}),
  response: DS.belongsTo('response', { inverse: null }),
  recipient: DS.belongsTo('user', { inverse: null }),
  wasSeen: DS.attr('boolean', { default: false })
});
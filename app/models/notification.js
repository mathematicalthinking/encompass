Encompass.Notification = DS.Model.extend(Encompass.Auditable, {
  text: DS.attr('string'),
  primaryRecordType: DS.attr('string'),
  notificationType: DS.attr('string'),
  submission: DS.belongsTo('submission', {inverse: null} ),
  workspace: DS.belongsTo('workspace'),
  response: DS.belongsTo('response'),
  recipient: DS.belongsTo('user'),
  assignment: DS.belongsTo('assignment'),
  problem: DS.belongsTo('problem'),
  section: DS.belongsTo('section'),
  organziation: DS.belongsTo('organization'),
  wasSeen: DS.attr('boolean', { defaultValue: false })
});
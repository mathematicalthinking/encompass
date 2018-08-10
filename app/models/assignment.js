Encompass.Assignment = DS.Model.extend(Encompass.Auditable, {
  assignmentId: Ember.computed.alias('id'),
  answers: DS.hasMany('answer', {async: true}),
  students: DS.hasMany('user', {inverse: null}),
  section: DS.belongsTo('section', {async: true}),
  problem: DS.belongsTo('problem', {async: true}),
  assignedDate: DS.attr('date'),
  dueDate: DS.attr('date')
});
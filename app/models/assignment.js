Encompass.Assignment = DS.Model.extend(Encompass.Auditable, {
  assignmentId: Ember.computed.alias('id'),
  answers: DS.hasMany('answer'),
  students: DS.hasMany('user'),
  section: DS.belongsTo('section'),
  problem: DS.belongsTo('problem'),
  assignedDate: DS.attr('date'),
  dueDate: DS.attr('date')
});
Encompass.Answer = DS.Model.extend(Encompass.Auditable, {
  answerId: Ember.computed.alias('id'),
  student: DS.belongsTo('user'),
  studentName: DS.attr('string'),
  problem: DS.belongsTo('problem'),
  answer: DS.attr('string'),
  explanation: DS.attr('string'),
  section: DS.belongsTo('section'),
  isSubmitted: DS.attr('boolean'),
  students: DS.belongsTo('user'),
  uploadedFile: DS.attr('string'),
  priorAnswerId: DS.belongsTo('answer')
});

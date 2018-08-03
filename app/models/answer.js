Encompass.Answer = DS.Model.extend(Encompass.Auditable, {
  answerId: Ember.computed.alias('id'),
  //student: DS.belongsTo('user'),
  studentName: DS.attr('string'),
  problem: DS.belongsTo('problem'),
  answer: DS.attr('string'),
  explanation: DS.attr('string'),
  section: DS.belongsTo('section'),
  isSubmitted: DS.attr('boolean'),
  students: DS.belongsTo('user'),
  uploadedFileId: DS.attr('string'),
  priorAnswer: DS.belongsTo('answer'),
  assignment: DS.belongsTo('assignment', {async: true}),
});

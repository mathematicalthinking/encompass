Encompass.Answer = DS.Model.extend(Encompass.Auditable, {
  studentId: DS.belongsTo('user'),
  studentName: DS.attr('string'),
  problemId: DS.belongsTo('problem'),
  answer: DS.attr('string'),
  explanation: DS.attr('string'),
  sectionId: DS.belongsTo('section'),
  isSubmitted: DS.attr('boolean'),
  students: DS.belongsTo('user'),
  uploadedFile: DS.attr('string'),
  priorAnswerId: DS.belongsTo('answer')
});

Encompass.Answer = DS.Model.extend(Encompass.Auditable, {
  studentId: DS.belongsTo('user'),
  problemId: DS.belongsTo('problem'),
  answer: DS.attr('string'),
  explanation: DS.attr('string'),
  sectionId: DS.belongsTo('section'),
  isSubmitted: DS.attr('boolean'),
  students: DS.belongsTo('user')
});

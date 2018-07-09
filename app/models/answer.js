Encompass.answer = DS.Model.extend(Encompass.Auditable, {
  studentId: DS.attr('string'),
  problemId: DS.belongsTo('problem'),
  answer: DS.attr('string'),
  explanation: DS.attr('string'),
  sectionId: DS.belongsTo('section'),
  isSubmitted: DS.attr('boolean')
});

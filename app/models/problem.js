Encompass.Problem = DS.Model.extend(Encompass.Auditable, {
  problemId: Ember.computed.alias('id'),
  title: DS.attr('string'),
  puzzleId: DS.attr('number'),
  text: DS.attr('string'),
  image: DS.attr('string'),
  sourceUrl: DS.attr('string'),
  additionalInfo: DS.attr('string'),
  isPublic: DS.attr('boolean', {
      defaultValue: false
  }),
  // categories: DS.attr('string'),
});
  // categories: DS.hasMany('category', {
  //     async: true
  // })

/* 
  Categories is commented out because the backend model is currently expecting an array 
  of 
*/
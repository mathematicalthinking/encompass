Encompass.Problem = DS.Model.extend(Encompass.Auditable, {
  problemId: Ember.computed.alias('id'),
  title: DS.attr('string'),
  puzzleId: DS.attr('number'),
  text: DS.attr('string'),
  imageUrl: DS.attr('string'),
  sourceUrl: DS.attr('string'),
  imageData: DS.attr('string'),
  imageId: DS.attr('string'),
  additionalInfo: DS.attr('string'),
  isPublic: DS.attr('boolean', {
      defaultValue: false
  }),
// categories: DS.hasMany('category', {
//     async: true
  // }),
});

/*
  Categories is commented out because the backend model is currently
  expecting an array of category ids which we do not have yet
*/
Encompass.Problem = DS.Model.extend(Encompass.Auditable, {
  problemId: Ember.computed.alias('id'),
  title: DS.attr('string'),
  puzzleId: DS.attr('number'),
  text: DS.attr('string'),
  imageUrl: DS.attr('string'),
  sourceUrl: DS.attr('string'),
  imageData: DS.attr('string'),
  imageId: DS.attr('string'),
  origin: DS.belongsTo('problem', { inverse: null }),
  additionalInfo: DS.attr('string'),
  isPublic: DS.attr('boolean', {
      defaultValue: false
  }),
  isPdf: function() {
    var imageData = this.get('imageData');
    if (imageData) {
      var ix = imageData.indexOf('base64');
      var str = imageData.slice(0, ix);
      return str.includes('pdf');
    }
  }.property('imageData'),
// categories: DS.hasMany('category', {
//     async: true
  // }),
});

/*
  Categories is commented out because the backend model is currently
  expecting an array of category ids which we do not have yet
*/
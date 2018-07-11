Encompass.Image = DS.Model.extend(Encompass.Auditable, {
  imageId: Ember.computed.alias('id'),
  encoding: DS.attr('string'),
  mimetype: DS.attr('string'),
  data: DS.attr('string'),
  sourceUrl: DS.attr('string'),
  isPdf: function() {
    var mimetype = this.get('mimetype');
    return mimetype === 'application/pdf';
  }.property(),

// categories: DS.hasMany('category', {
//     async: true
  // }),
});
Encompass.Image = DS.Model.extend(Encompass.Auditable, {
  imageId: Ember.computed.alias('id'),
  encoding: DS.attr('string'),
  mimetype: DS.attr('string'),
  imageData: DS.attr('string'),
  sourceUrl: DS.attr('string'),
});
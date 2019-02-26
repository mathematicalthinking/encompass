Encompass.Image = DS.Model.extend(Encompass.Auditable, {
  imageId: Ember.computed.alias('id'),
  encoding: DS.attr('string'),
  mimetype: DS.attr('string'),
  imageData: DS.attr('string'),
  sourceUrl: DS.attr('string'),
  originalname: DS.attr('string'),
  pdfPageNum: DS.attr('number'),

  pdfFileDisplay: function() {

  }.property('pdfPageNum', ),

  fileNameDisplay: function() {
    let num = this.get('pdfPageNum');
    if (typeof num === 'number') {
      return `${this.get('originalname')} (pg. ${num})`;
    }

    return this.get('originalname');
  }.property('originalname', 'pdfPageNum'),
});
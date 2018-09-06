Encompass.Answer = DS.Model.extend(Encompass.Auditable, {
  answerId: Ember.computed.alias('id'),
  //student: DS.belongsTo('user'),
  studentName: DS.attr('string'),
  problem: DS.belongsTo('problem'),
  answer: DS.attr('string'),
  explanation: DS.attr('string'),
  section: DS.belongsTo('section'),
  isSubmitted: DS.attr('boolean'),
  students: DS.hasMany('users', { inverse: null }),
  // uploadedFileId: DS.attr('string'),
  priorAnswer: DS.belongsTo('answer'),
  assignment: DS.belongsTo('assignment', { async: true }),
  additionalImage: DS.belongsTo('image', { inverse: null }),
  // imageData: DS.attr('string'),
  // isPdf: function() {
  //   var imageData = this.get('imageData');
  //   if (imageData) {
  //     var ix = imageData.indexOf('base64');
  //     var str = imageData.slice(0, ix);
  //     return str.includes('pdf');
  //   }
  // }.property('imageData'),
});

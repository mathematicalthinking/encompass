Encompass.Answer = DS.Model.extend(Encompass.Auditable, {
  answerId: Ember.computed.alias('id'),
  studentName: DS.attr('string'),
  problem: DS.belongsTo('problem'),
  answer: DS.attr('string'),
  explanation: DS.attr('string'),
  explanationImage: DS.belongsTo('image', { inverse: null }),
  section: DS.belongsTo('section'),
  isSubmitted: DS.attr('boolean'),
  students: DS.hasMany('users', { inverse: null }),
  studentNames: DS.attr(),
  priorAnswer: DS.belongsTo('answer'),
  assignment: DS.belongsTo('assignment', { async: true }),
  additionalImage: DS.belongsTo('image', { inverse: null }),

  student: function() {
    const creatorUsername = this.get('createdBy.username');
    if (creatorUsername && creatorUsername !== 'old_pows_user') {
      return creatorUsername;
    }
    if(this.get('studentName')) {
      return this.get('studentName');
    }
    const names = this.get('studentNames');

    if (Array.isArray(names)) {
      if (names.length > 0) {
        return names[0];
      }
    }
  }.property('createdBy.username', 'studentNames', 'studentName'),
});

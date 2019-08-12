/*global _:false */
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
  workspacesToUpdate: DS.attr(''),

  student: function() {
    const creatorUsername = this.get('createdBy.username');
    if (creatorUsername && creatorUsername !== 'old_pows_user') {
      return creatorUsername;
    }
    const studentName = this.get('studentName');
    if (typeof studentName === 'string') {
      return studentName.trim();
    }

    const names = this.get('studentNames');

    if (Array.isArray(names)) {
      let firstStringName = _.find(names, _.isString);
      if (firstStringName) {
        return firstStringName.trim();
      }
    }
  }.property('createdBy.username', 'studentNames.[]', 'studentName'),
});

Encompass.Section = DS.Model.extend(Encompass.Auditable, {
  sectionId: Ember.computed.alias('id'),
  name: DS.attr('string'),
  organization: DS.belongsTo('organization', {inverse: null}),
  teachers: DS.hasMany('user'),
  sectionPassword: DS.attr('string'),
  students: DS.hasMany('user'),
  problems: DS.hasMany('problem'),
  assignments: DS.hasMany('assignment')
});
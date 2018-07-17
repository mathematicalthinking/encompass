Encompass.Section = DS.Model.extend(Encompass.Auditable, {
  sectionId: Ember.computed.alias('id'),
  name: DS.attr('string'),
  organization: DS.belongsTo('organization', {inverse: null}),
  teachers: DS.hasMany('users'),
  students: DS.hasMany('users'),
  problems: DS.hasMany('problem'),
});
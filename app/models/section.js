Encompass.Section = DS.Model.extend(Encompass.Auditable, {
  sectionId: Ember.computed.alias('id'),
  name: DS.attr('string'),
  schoolId: DS.attr('string'),
  teachers: DS.hasMany('users'),
  students: DS.hasMany('users'),
  problems: DS.hasMany('problem'),
});

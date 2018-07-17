Encompass.Organization = DS.Model.extend(Encompass.Auditable, {
  organizationId: Ember.computed.alias('id'),
  name: DS.attr('string'),
});
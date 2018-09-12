Encompass.Category = DS.Model.extend(Encompass.Auditable, {
  identifier: DS.attr('string'),
  description: DS.attr('string'),
  url: DS.attr('string'),
});

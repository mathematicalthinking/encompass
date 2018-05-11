Encompass.FolderSet = DS.Model.extend({
  label: Ember.computed.alias('id'),
  name: DS.attr('string')
});

Encompass.FolderSet = DS.Model.extend(Encompass.Auditable, {
  name: DS.attr('string'),
  privacySetting: DS.attr('string'),
  folders: DS.attr()
});

Encompass.NewWorkspaceRequest = DS.Model.extend(Encompass.Auditable, {
  pdSetName: DS.attr('string'),
  folderSetName: DS.attr('string'),
  result: DS.belongsTo('workspace')
});

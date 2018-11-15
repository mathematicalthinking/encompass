Encompass.CopyWorkspaceRequest = DS.Model.extend(Encompass.Auditable, {
  name: DS.attr('string'),
  owner: DS.belongsTo('user', { inverse: null }),
  originalWsId: DS.belongsTo('workspace', {inverse: null}),
  answerOptions: DS.attr(),
  folderOptions: DS.attr(),
  selectionOptions: DS.attr(),
  commentOptions: DS.attr(),
  responseOptions: DS.attr(),
  permissionOptions: DS.attr(),
  copyWorkspaceError: DS.attr('string'),
  createdWorkspace: DS.belongsTo('workspace'),
});
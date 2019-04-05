Encompass.VmtImportRequest = DS.Model.extend(Encompass.Auditable, {
  workspaceName: DS.attr('string'),
  workspaceMode: DS.attr('string'),
  workspaceOwner: DS.belongsTo('user', { inverse: null }),
  folderSet: DS.belongsTo('folder-set', {inverse: null}),
  vmtRooms: DS.attr(),
  vmtUserInfo: DS.attr(), // vmt user credentials used for the search
  permissionObjects: DS.attr(),
  createdWorkspace: DS.belongsTo('workspace'),
  createdAnswers: DS.hasMany('answer', {inverse: null }),
  createdSubmissions: DS.hasMany('submission', {inverse: null }),
  createWorkspaceError: DS.attr('string'),
  doCreateWorkspace: DS.attr('boolean'),

});
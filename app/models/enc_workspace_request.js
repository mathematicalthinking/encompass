Encompass.EncWorkspaceRequest = DS.Model.extend(Encompass.Auditable, {
  teacher: DS.belongsTo('user', {inverse: null}),
  assignment: DS.belongsTo('assignment', {inverse: null}),
  problem: DS.belongsTo('problem', {inverse: null}),
  section: DS.belongsTo('section', {inverse: null}),
  startDate: DS.attr('date'),
  endDate: DS.attr('date'),
  pdSetName: DS.attr('string'),
  folderSetName: DS.attr('string'),
  result: DS.belongsTo('workspace')
});

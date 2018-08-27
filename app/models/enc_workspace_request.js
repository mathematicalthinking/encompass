Encompass.EncWorkspaceRequest = DS.Model.extend(Encompass.Auditable, {
  teacher: DS.belongsTo('user', { inverse: null }),
  assignment: DS.belongsTo('assignment', { inverse: null }),
  problem: DS.belongsTo('problem', { inverse: null }),
  section: DS.belongsTo('section', { inverse: null }),
  startDate: DS.attr('date'),
  endDate: DS.attr('date'),
  pdSetName: DS.attr('string'),
  folderSetName: DS.attr('string'),
  requestedName: DS.attr('string'),
  createdWorkspace: DS.belongsTo('workspace'),
  isEmptyAnswerSet: DS.attr('boolean', { default: null }),
  createWorkspaceError: DS.attr('string'),
  owner: DS.belongsTo('user', { inverse: null }),
  mode: DS.attr('string')
});

Encompass.UpdateWorkspaceRequest = DS.Model.extend(Encompass.Auditable, {
  workspace: DS.belongsTo('workspace', { inverse: null }),
  linkedAssignment: DS.belongsTo('assignment', {inverse: null}),
  errors: DS.attr(),
  addedSubmissions: DS.hasMany('submission', {inverse: null}),
  wereNoAnswersToUpdate: DS.attr('boolean', { default: false }),
});
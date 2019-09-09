Encompass.UpdateWorkspaceRequest = DS.Model.extend(Encompass.Auditable, {
  workspace: DS.belongsTo('workspace', { inverse: null }),
  linkedAssignment: DS.belongsTo('assignment', { inverse: null }),
  updateErrors: DS.attr(),
  addedSubmissions: DS.hasMany('submission', { inverse: null }),
  wereNoAnswersToUpdate: DS.attr('boolean', { defaultValue: false }),
  isParentUpdate: DS.attr('boolean', { defaultValue: false }),
  createdParentData: DS.attr(),
  wasNoDataToUpdate: DS.attr('boolean', { defaultValue: false }),
  updatedParentData: DS.attr(),
});
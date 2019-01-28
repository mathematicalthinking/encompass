Encompass.UpdateWorkspaceRequest = DS.Model.extend(Encompass.Auditable, {
  workspaceId: DS.attr(),
  linkedAssignmentId: DS.attr(),
  errors: DS.attr(),
  failedAnswers: DS.hasMany('answer', { inverse: null }),
  updatedSubmissions: DS.hasMany('submission', {inverse: null}),
  updatedAnswers: DS.hasMany('answer', {inversE: null }),
});
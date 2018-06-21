'use strict';

Encompass.NewWorkspaceRequest = DS.Model.extend(Encompass.Auditable, {
  pdSetName: DS.attr('string'),
  folderSetName: DS.attr('string'),
  result: DS.belongsTo('workspace')
});
//# sourceMappingURL=new_workspace_request.js.map

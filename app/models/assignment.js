import Model, { attr, hasMany, belongsTo } from '@ember-data/model';
import { alias } from '@ember/object/computed';
import Auditable from "../models/_auditable_mixin";

export default Model.extend(Auditable, {
  assignmentId: alias("id"),
  name: attr("string"),
  answers: hasMany("answer", { async: true }),
  students: hasMany("user", { inverse: null }),
  section: belongsTo("section", { async: true }),
  problem: belongsTo("problem", { async: true }),
  assignedDate: attr("date"),
  dueDate: attr("date"),
  taskWorkspace: belongsTo("workspace", { inverse: null }),
  assignmentType: attr("string"),
  linkedWorkspaces: hasMany("workspace", { inverse: null }),
  parentWorkspace: belongsTo("workspace", { inverse: null }),
  reportDetails: attr(), // for assignment report,
  linkedWorkspacesRequest: attr({
    defaultValue: () => {
    return {
        doCreate: false,
        error: null,
        createdWorkspaces: [],
        doAllowSubmissionUpdates: false,
        name: null,
      }
    },
  }),
  parentWorkspaceRequest: attr({
    defaultValue: () => {
        return {
        doCreate: false,
        error: null,
        createdWorkspace: null,
        doAutoUpdateFromChildren: false,
        name: null,
      }
    },
  }),
});

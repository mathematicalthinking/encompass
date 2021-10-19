import { attr, hasMany, belongsTo } from '@ember-data/model';
import Auditable from './auditable';

export default class AssignmentModel extends Auditable {
  get assignmentId() {
    return this.id;
  }
  @attr('string') name;
  @hasMany('answer', { async: true }) answers;
  @hasMany('user', { inverse: null }) students;
  @belongsTo('section', { async: true }) section;
  @belongsTo('problem', { async: true }) problem;
  @attr('date') assignedDate;
  @attr('date') dueDate;
  @belongsTo('workspace', { inverse: null }) taskWorkspace;
  @attr('string') assignmentType;
  @hasMany('workspace', { inverse: null }) linkedWorkspaces;
  @belongsTo('workspace', { inverse: null }) parentWorkspace;
  @attr reportDetails;
  @attr({
    defaultValue: () => {
      return {
        doCreate: false,
        error: null,
        createdWorkspaces: [],
        doAllowSubmissionUpdates: false,
        name: null,
      };
    },
  })
  linkedWorkspacesRequest;
  @attr({
    defaultValue: () => {
      return {
        doCreate: false,
        error: null,
        createdWorkspace: null,
        doAutoUpdateFromChildren: false,
        name: null,
        giveAccess: false,
      };
    },
  })
  parentWorkspaceRequest;
}

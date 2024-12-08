import { attr, hasMany, belongsTo } from '@ember-data/model';
import AuditableModel from './auditable';

export default class AssignmentModel extends AuditableModel {
  get assignmentId() {
    return this.id;
  }
  @attr('string') name;
  @hasMany('answer', { inverse: 'assignment', async: true }) answers;
  @hasMany('user', { inverse: null, async: true }) students;
  @belongsTo('section', { inverse: 'assignment', async: true }) section;
  @belongsTo('problem', { inverse: null, async: true }) problem;
  @attr('date') assignedDate;
  @attr('date') dueDate;
  @belongsTo('workspace', { inverse: null, async: true }) taskWorkspace;
  @attr('string') assignmentType;
  @hasMany('workspace', { inverse: null, async: true }) linkedWorkspaces;
  @belongsTo('workspace', { inverse: null, async: true }) parentWorkspace;
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

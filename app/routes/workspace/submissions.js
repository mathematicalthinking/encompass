/**
 * # Workspace Submissions Route
 * @description This route resolves the submissions for the workspace
 * @author Amir Tahvildaran <amir@mathforum.org>, Tim Leonard <tleonard@21pstem.org>
 * @since 1.0.1
 */

// Is this route necessary?
// workspace submissions are being sideloaded when workspace is fetched
import Route from '@ember/routing/route';

export default class WorkspaceSubmissionRoute extends Route {
  async model() {
    let workspace = await this.modelFor('workspace');
    let submissions = await workspace.hasMany('submissions').value();
    if (submissions !== null) {
      return submissions;
    }
    return workspace.get('submissions');
  }
}

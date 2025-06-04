/**
 * # Workspace Submissions Route
 * @description This route resolves the submissions for the workspace
 * @author Amir Tahvildaran <amir@mathforum.org>, Tim Leonard <tleonard@21pstem.org>
 * @since 1.0.1
 */

// app/routes/workspace/submissions.js
import Route from '@ember/routing/route';

export default class WorkspaceSubmissionsRoute extends Route {
  async model() {
    const workspace = await this.modelFor('workspace');
    const submissions = await workspace.submissions;

    return submissions;
  }
}

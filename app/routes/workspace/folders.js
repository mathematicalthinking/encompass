/**
 * # Workspace Submissions Route
 * @description This route resolves the submissions for the workspace
 * @author Amir Tahvildaran <amir@mathforum.org>
 * @since 1.0.1
 */
import Route from '@ember/routing/route';

export default class WorkspaceFoldersRoute extends Route {
  async model() {
    let { folders } = await this.modelFor('workspace');
    return folders;
  }
}

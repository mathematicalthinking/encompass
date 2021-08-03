/**
  * # Workspace Submissions Route
  * @description This route resolves the submissions for the workspace
  * @author Amir Tahvildaran <amir@mathforum.org>
  * @since 1.0.1
  */

// Is this route necessary?
// workspace submissions are being sideloaded when workspace is fetched
import Route from '@ember/routing/route';






export default Route.extend({
  async model() {
    let workspace = this.modelFor('workspace');

    let submissions = await workspace.hasMany('submissions').value();
    if (submissions !== null) {
      return submissions;
    }
    return workspace.get('submissions');
  }
});

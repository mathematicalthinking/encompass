/**
 * # Workspace Submissions Route
 * @description This route resolves the submissions for the workspace
 * @author Amir Tahvildaran <amir@mathforum.org>
 * @since 1.0.1
 */
import Route from '@ember/routing/route';

export default Route.extend({
  model: function () {
    var workspace = this.modelFor('workspace');
    return workspace.get('folders');
  },
});

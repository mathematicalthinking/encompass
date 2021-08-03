import { hash } from 'rsvp';
import AuthenticatedRoute from '../_authenticated_route';

export default AuthenticatedRoute.extend({
  beforeModel: function (transition) {
    this._super.apply(this, arguments);

    let workspace = transition.queryParams.workspace;
    this.set('workspaceId', workspace);
  },

  model: function () {
    const store = this.store;
    this.set('workspaceToCopy', this.workspaceId);
    return hash({
      folderSets: store.findAll('folderSet'),
      workspaceToCopy: this.workspaceId,
    });
  },
  actions: {
    toWorkspace(id) {
      this.transitionTo('workspace.work', id);
    },
  },
});

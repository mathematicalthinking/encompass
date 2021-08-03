import { hash } from 'rsvp';
import AuthenticatedRoute from '../_authenticated_route';

export default AuthenticatedRoute.extend({
  controllerName: 'vmt-import',

  model() {
    return hash({
      folderSets: this.store.findAll('folderSet'),
      users: this.store.findAll('user'),
    });
  },

  actions: {
    toWorkspaces: function (workspaceId) {
      this.transitionTo('workspace.work', workspaceId);
      // window.location.href = `#/workspaces/${workspace._id}/submissions/${workspace.submissions[0]}`;
    },
  },

  renderTemplate() {
    this.render('vmt/import');
  },
});

import { hash } from 'rsvp';
import AuthenticatedRoute from '../_authenticated_route';
import { inject as service } from '@ember/service';

export default AuthenticatedRoute.extend({
  controllerName: 'vmt-import',
  router: service(),

  model() {
    return hash({
      folderSets: this.store.findAll('folderSet'),
      users: this.store.findAll('user'),
    });
  },

  actions: {
    toWorkspaces: function (workspaceId) {
      this.router.transitionTo('workspace.work', workspaceId);
      // window.location.href = `#/workspaces/${workspace._id}/submissions/${workspace.submissions[0]}`;
    },
  },

  renderTemplate() {
    this.render('vmt/import');
  },
});

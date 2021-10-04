import { hash } from 'rsvp';
import AuthenticatedRoute from './_authenticated_route';
import ConfirmLeavingRoute from './_confirm_leaving_route';

export default AuthenticatedRoute.extend(ConfirmLeavingRoute, {
  controllerName: 'import',

  model: function () {
    return hash({
      sections: this.store.findAll('section'),
      folderSets: this.store.findAll('folderSet'),
      users: this.store.findAll('user'),
      problems: this.store.findAll('problem'),
    });
  },

  actions: {
    toWorkspaces: function (workspace) {
      window.location.href = `#/workspaces/${workspace._id}/submissions/${workspace.submissions[0]}`;
    },
  },

  renderTemplate: function () {
    this.render('import/import');
  },
});

Encompass.DashboardWorkspacesListComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  utils: Ember.inject.service('utility-methods'),
  tableHeight: '',

  didReceiveAttrs: function() {
    this.calculateTableHeight();
  },

  calculateTableHeight: function () {
    this.tableHeight = this.workspaces.content.length  * 31 + 'px';
  },
});

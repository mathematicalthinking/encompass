Encompass.DashboardWorkspacesListComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  utils: Ember.inject.service('utility-methods'),
  tableHeight: '',


  didReceiveAttrs: function() {
    this.calculateWSListHeight();
  },


  calculateWSListHeight: function () {
    this.tableHeight = this.workspaces.content.length  * 31 + 'px';
  },
});

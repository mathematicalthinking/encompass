/**
 * Passed in by template:
 * - workspace
 * - linkedWorkspace
 *
 */
Encompass.WorkspaceTableRowComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  utils: Ember.inject.service('utility-methods'),

  didReceiveAttrs: function() {
    this.getLinkedAssignment();
  },
  getLinkedAssignment() {
    console.log('jenns', this.workspace);
  }
});

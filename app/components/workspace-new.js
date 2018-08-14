Encompass.WorkspaceNewComponent = Ember.Component.extend({
  ElementId: 'workspace-new',
  isPows: true,

  actions: {
    toggleView: function(view) {
      console.log('view', view);
      if (view === 'pows') {
        this.set('isPows', true);
      } else {
        this.set('isPows', false);
      }
    }
  }
});
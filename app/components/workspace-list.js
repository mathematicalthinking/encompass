import Component from '@ember/component';

export default Component.extend({
  elementId: 'workspace-list',

  actions: {
    toCopyWorkspace(workspace) {
      this.toCopyWorkspace(workspace);
    },
  },
});

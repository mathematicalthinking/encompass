import Component from '@ember/component';
import { computed } from '@ember/object';
/*global _:false */
import { inject as service } from '@ember/service';

export default Component.extend({
  elementId: 'ws-copy-workspace',
  utils: service('utility-methods'),

  didReceiveAttrs() {
    this._super(...arguments);
    const workspaceToCopy = this.workspaceToCopy;
    if (
      this.utils.isNonEmptyObject(workspaceToCopy) &&
      this.utils.isNullOrUndefined(this.selectedWorkspace)
    ) {
      this.set('selectedWorkspace', workspaceToCopy);
    }
  },

  initialWorkspaceItem: computed('selectedWorkspace', function () {
    const selectedWorkspace = this.selectedWorkspace;
    if (this.utils.isNonEmptyObject(selectedWorkspace)) {
      return [selectedWorkspace.id];
    }
    return [];
  }),

  initialWorkspaceOptions: computed('selectedWorkspace', function () {
    const selectedWorkspace = this.selectedWorkspace;

    if (this.utils.isNonEmptyObject(selectedWorkspace)) {
      return [
        {
          id: selectedWorkspace.id,
          name: selectedWorkspace.get('name'),
        },
      ];
    }
    return [];
  }),

  actions: {
    setSelectedWorkspace(val, $item) {
      if (!val) {
        return;
      }

      const isRemoval = _.isNull($item);
      if (isRemoval) {
        this.set('selectedWorkspace', null);
        return;
      }

      const workspace = this.store.peekRecord('workspace', val);
      if (this.utils.isNullOrUndefined(workspace)) {
        return;
      }

      this.set('selectedWorkspace', workspace);
      if (this.missingWorkspace) {
        this.set('missingWorkspace', null);
      }
    },
    next() {
      const workspace = this.selectedWorkspace;

      // workspace is required to go to next step
      if (this.utils.isNonEmptyObject(workspace)) {
        const submissionsLength = workspace.get('submissionsLength');

        // only allowing workspaces with > 0 submissions
        if (submissionsLength > 0) {
          this.onProceed();
          return;
        }
        this.set('tooFewSubmissions', true);
        return;
      }

      this.set('missingWorkspace', true);
    },
  },
});

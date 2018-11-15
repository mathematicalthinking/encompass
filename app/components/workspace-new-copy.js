/*global _:false */
Encompass.WorkspaceNewCopyComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {
  elementId: 'workspace-new-copy',
  selectedConfig: null,
  workspaceToCopy: null,
  customConfig: null,
  owner: null,
  privacySetting: "M" ,

  selectedConfigDisplay: function() {
    if (_.isNull(this.get('selectedConfig'))) {
      return;
    }
    const hash = {
      A: 'Shallow with Folder Structure',
      B: 'Shallow with No Folders',
      C: 'Full Deep Copy',
      D: 'Custom'
    };
    return hash[this.get('selectedConfig')];
  }.property('selectedConfig'),

  currentStep: function() {
    if (_.isNull(this.get('workspaceToCopy'))) {
      return 1;
    }

    if (_.isNull(this.get('selectedConfig'))) {
      return 2;
    }
    if (this.get('selectedConfig') === 'D' && _.isNull(this.get('customConfig'))) {
      return 'custom';
    }

    if (_.isNull(this.get('owner'))) {
      return 'owner';
    }
  }.property('workspaceToCopy', 'selectedConfig', 'owner', 'customConfig'),

  actions: {
    setOriginalWorkspace(val, $item) {
      if (!val) {
        return;
      }
      this.set('originalWorkspaceId', val);
      const workspace = this.get('store').peekRecord('workspace', val);
      this.set('workspaceToCopy', workspace);
    },
    setOwner(val, $item) {
      if (!val) {
        return;
      }
      const user = this.get('store').peekRecord('user', val);
      this.set('owner', user);
    },
    createCopyRequest() {
      const selectedConfig = this.get('selectedConfig');
      const owner = this.get('owner');
      const name = this.get('name');
      const originalWsId = this.get('workspaceToCopy');
      let copyRequest;
      let requestSource;

      let base = {
        owner,
        name,
        originalWsId,
        createDate: Date.now(),
        lastModifiedDate: Date.now(),
        createdBy: this.get('currentUser')
      };

      let baseOptions = {
        answerOptions : { all: true },
        folderOptions : {
          includeStructureOnly: true,
          folderSetOptions: {
            doCreateFolderSet: false
          },
          all: true
        },
        selectionOptions : { none: true },
        commentOptions : { none: true },
        responseOptions : {  none: true}
      };

        // basic shallow with folders

      if (selectedConfig === 'A') {
        requestSource = Object.assign(base, baseOptions);

      } else if (selectedConfig === 'B') {
        delete baseOptions.folderOptions.all;
        baseOptions.folderOptions.none = true;
        requestSource = Object.assign(base, baseOptions);
      } else if (selectedConfig === 'C') {
        baseOptions.folderOptions.includeStructureOnly = false;

        baseOptions.selectionOptions.all = true;
        delete baseOptions.selectionOptions.none;

        baseOptions.commentOptions.all = true;
        delete baseOptions.commentOptions.none;

        baseOptions.responseOptions.all = true;
        delete baseOptions.responseOptions.none;
        requestSource = Object.assign(base, baseOptions);
      }
      copyRequest = this.get('store').createRecord('copyWorkspaceRequest', requestSource);

      copyRequest.save()
        .then((result) => {
          const error = result.get('copyWorkspaceError');
          if (error) {
            this.set('copyWorkspaceError', error);
            return;
          }
          const createdWorkspace = result.get('createdWorkspace');

          if (createdWorkspace) {
            this.sendAction('toWorkspace', createdWorkspace);
          }
        })
        .catch((err) => {
          this.handleErrors(err, 'serverErrors');
        });

    }
  }
});
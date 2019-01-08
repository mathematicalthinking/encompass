/*global _:false */
Encompass.ImportWorkStep5Component = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'import-work-step5',
  creatingWs: Ember.computed.equal('selectedValue', true),
  selectedMode: 'private',
  createWs: {
    groupName: 'createWs',
    required: true,
    inputs: [{
        value: true,
        label: 'Yes',
      },
      {
        value: false,
        label: 'No',
      },
    ]
  },
  createAssignment: {
    groupName: 'createAssignment',
    required: true,
    inputs: [{
        value: true,
        label: 'Yes',
      },
      {
        value: false,
        label: 'No',
      },
    ]
  },
  ownerOptions: function() {
    if (this.get('users')) {
      return this.get('users').map((user) => {
        return {
          id: user.get('id'),
          username: user.get('username')
        };
      });
    }
    return [];
  }.property('users.[]'),
  modeInputs: function() {
    let res = {
      groupName: 'mode',
      required: true,
      inputs: [
        {
          value: 'private',
          label: 'Private',
          moreInfo: 'Workspace will only be visible to the owner and collaborators',
        },
        {
          value: 'org',
          label: 'My Org',
          moreInfo: 'Workspace will be visible to everyone belonging to your org',
        },
        {
          value: 'public',
          label: 'Public',
          moreInfo: 'Workspace will be visible to every Encompass user',
        },
      ]
    };

    if (this.get('currentUser.isStudent') || !this.get('currentUser.isAdmin') ) {
      return res;
    }

    res.inputs.push({
      value: 'internet',
      label: 'Internet',
      moreInfo: 'Workspace will be accesible to any user with a link to the workspace',
    });
    return res;
  }.property('currentUser.isStudent', 'currentUser.isAdmin'),

  actions: {
    updateSelectizeSingle(val, $item, propToUpdate, model) {
      if (_.isNull($item)) {
        this.set(propToUpdate, null);
        return;
      }
      let record = this.get('store').peekRecord(model, val);
      if (!record) {
        return;
      }
      this.set(propToUpdate, record);
    },
    next() {
      const uploadedFiles = this.get('uploadedFiles');
      if (uploadedFiles.length >= 1) {
        this.get('onProceed')();
        return;
      }
      this.set('missingFiles', true);

    },
    back() {
      this.get('onBack')(-1);
    }
  }
});
/*global _:false */
Encompass.WsCopyConfigComponent = Ember.Component.extend({
  elementId: 'ws-copy-config',
  showCustomConfig: Ember.computed.equal('selectedConfig', 'D'),
  utils: Ember.inject.service('utility-methods'),

  copyConfig:
    {
      groupName: 'copyConfig',
      required: true,
      inputs: [
        {
          value: 'A',
          label: 'Submissions Only',
          moreInfo: 'Copy only the submissions used in this workspace'
        },
        {
          value: 'B',
          label: 'Submissions and Folder Structure',
          moreInfo: 'Copy the submissions and the folder structure (not content) used in this workspace'
        },
        {
          value: 'C',
          label: 'Everything',
          moreInfo: 'Copy everything used in this workspace (submissions, selections, folders, taggings, comments, responses)'
        },
        {
          value: 'D',
          label: 'Custom',
          moreInfo: 'Decide which to copy for submissions, selections, folders, taggings, comments and responses'
        }
      ]
    },

  validConfigValues: function() {
    const configInputs = this.get('copyConfig.inputs');

    if (this.get('utils').isNonEmptyArray(configInputs)) {
      return configInputs.map(input => input.value);
    }
    return [];

  }.property('copyConfig'),

  didReceiveAttrs() {
    const newWsConfig = this.get('newWsConfig');
    const selectedConfig = this.get('selectedConfig');

    const validValues = this.get('validConfigValues');
    // if reaching via back button, set selectedConfig to previously selected value
    // else set as A
    if (validValues.includes(newWsConfig)) {
      this.set('selectedConfig', newWsConfig);
    } else if (!validValues.includes(selectedConfig)) {
      this.set('selectedConfig', 'A');
    }

    this._super(...arguments);
  },

  actions: {
    next() {
      const selectedConfig = this.get('selectedConfig');
      const validConfigValues = this.get('validConfigValues');

      if (validConfigValues.includes(selectedConfig)) {
        this.get('onProceed')(this.get('selectedConfig'));
        return;
      }
      this.set('invalidOrMissingConfig', true);
    },

    nextCustom(customConfig) {
      // make sure user has chosen a configuration that has at least 1 submission
      if (!this.get('utils').isNonEmptyObject(customConfig)) {
        return;
      }

      let submissionOptions = customConfig.submissionOptions;
      let isAllSubmissions;
      let customSubmissionsCount;

      if (_.isObject(submissionOptions)) {
        isAllSubmissions = submissionOptions.all === true;
        let customIds = submissionOptions.submissionIds;

        if (_.isArray(customIds)) {
          customSubmissionsCount = customIds.length;
        }
      }
      if (isAllSubmissions || customSubmissionsCount > 0) {
        this.get('onProceed')(this.get('selectedConfig'), customConfig);
      } else {
        // insufficient submissions
        this.set('insufficientSubmissions', true);
      }
    },
    back() {
      this.get('onBack')(-1);
    }
  }
});
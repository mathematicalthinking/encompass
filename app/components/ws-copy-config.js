import Component from '@ember/component';
import { computed } from '@ember/object';
import { equal } from '@ember/object/computed';
/*global _:false */
import { inject as service } from '@ember/service';

export default Component.extend({
  elementId: 'ws-copy-config',
  showCustomConfig: equal('selectedConfig', 'D'),
  utils: service('utility-methods'),

  validConfigValues: computed('copyConfig', function () {
    const configInputs = this.copyConfig.inputs;

    if (this.utils.isNonEmptyArray(configInputs)) {
      return configInputs.map((input) => input.value);
    }
    return [];
  }),

  didReceiveAttrs() {
    const newWsConfig = this.newWsConfig;
    const selectedConfig = this.selectedConfig;

    const validValues = this.validConfigValues;
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
      const selectedConfig = this.selectedConfig;
      const validConfigValues = this.validConfigValues;

      if (validConfigValues.includes(selectedConfig)) {
        this.onProceed(this.selectedConfig);
        return;
      }
      this.set('invalidOrMissingConfig', true);
    },

    nextCustom(customConfig) {
      // make sure user has chosen a configuration that has at least 1 submission
      if (!this.utils.isNonEmptyObject(customConfig)) {
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
        this.onProceed(this.selectedConfig, customConfig);
      } else {
        // insufficient submissions
        this.set('insufficientSubmissions', true);
      }
    },
    back() {
      this.onBack(-1);
    },
  },
});

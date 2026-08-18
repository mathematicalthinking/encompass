import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import isObject from 'lodash-es/isObject';
import isArray from 'lodash-es/isArray';

export default class WsCopyConfigComponent extends Component {
  @service('utility-methods') utils;

  // local selection for this step; reported up via @onProceed. Seeded from
  // @newWsConfig so the back button restores the previous choice.
  @tracked selectedConfig = this.initialConfig;
  @tracked invalidOrMissingConfig = false;
  @tracked insufficientSubmissions = false;

  get initialConfig() {
    const newWsConfig = this.args.newWsConfig;
    return this.validConfigValues.includes(newWsConfig) ? newWsConfig : 'A';
  }

  get validConfigValues() {
    const configInputs = this.args.copyConfig?.inputs;
    if (this.utils.isNonEmptyArray(configInputs)) {
      return configInputs.map((input) => input.value);
    }
    return [];
  }

  get showCustomConfig() {
    return this.selectedConfig === 'D';
  }

  @action
  updateSelectedConfig(val) {
    this.selectedConfig = val;
  }

  @action
  next() {
    if (this.validConfigValues.includes(this.selectedConfig)) {
      this.args.onProceed(this.selectedConfig);
      return;
    }
    this.invalidOrMissingConfig = true;
  }

  @action
  nextCustom(customConfig) {
    // make sure user has chosen a configuration that has at least 1 submission
    if (!this.utils.isNonEmptyObject(customConfig)) {
      return;
    }

    let submissionOptions = customConfig.submissionOptions;
    let isAllSubmissions;
    let customSubmissionsCount;

    if (isObject(submissionOptions)) {
      isAllSubmissions = submissionOptions.all === true;
      let customIds = submissionOptions.submissionIds;

      if (isArray(customIds)) {
        customSubmissionsCount = customIds.length;
      }
    }
    if (isAllSubmissions || customSubmissionsCount > 0) {
      this.args.onProceed(this.selectedConfig, customConfig);
    } else {
      // insufficient submissions
      this.insufficientSubmissions = true;
    }
  }

  @action
  back() {
    this.args.onBack(-1);
  }

  @action
  resetInvalidOrMissingConfig() {
    this.invalidOrMissingConfig = false;
  }

  @action
  resetInsufficientSubmissions() {
    this.insufficientSubmissions = false;
  }
}

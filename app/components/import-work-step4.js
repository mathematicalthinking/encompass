import Component from '@ember/component';
import { computed } from '@ember/object';
import { service } from '@ember/service';

export default Component.extend({
  elementId: 'import-work-step4',
  utils: service('utility-methods'),
  alert: service('sweet-alert'),

  addedStudentNames: [],

  init() {
    this._super(...arguments);
    this.set('newNameFilter', this.addStudentNameFilter.bind(this));
  },

  displayList: computed('studentMap', function () {
    if (!this.studentMap) {
      return [];
    }
    return Object.keys(this.studentMap).map((key) => this.studentMap[key]);
  }),

  addStudentNameFilter: function (name) {
    if (typeof name !== 'string') {
      return;
    }
    let trimmed = name.trim();
    let names = this.addedStudentNames;
    return trimmed.length > 1 && !names.includes(trimmed);
  },

  isReadyToProceed() {
    let answers = this.answers;
    return (
      Array.isArray(answers) &&
      answers.length > 0 &&
      answers.every((ans) => {
        return (
          this.utils.isNonEmptyArray(ans.students) ||
          this.utils.isNonEmptyArray(ans.studentNames)
        );
      })
    );
  },

  actions: {
    checkStatus: function () {
      let isReady = this.isReadyToProceed();
      if (isReady && this.isMatchingIncompleteError) {
        this.set('isMatchingIncompleteError', null);
      }
      this.set('isReadyToReviewAnswers', isReady);
      return isReady;
    },
    next() {
      let isReady = this.send('checkStatus');
      if (isReady) {
        this.onProceed();
      } else {
        this.set('isMatchingIncompleteError', true);
        this.alert.showToast(
          'error',
          'Please match at least one student/name for each submission',
          'bottom-end',
          3000,
          false,
          null
        );
      }
    },
    back() {
      this.onBack(-1);
    },
  },
});

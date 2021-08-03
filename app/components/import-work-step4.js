import Component from '@ember/component';
import { computed } from '@ember/object';
/*global _:false */
import { inject as service } from '@ember/service';
import CurrentUserMixin from '../mixins/current_user_mixin';

export default Component.extend(CurrentUserMixin, {
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
    return _.map(this.studentMap, (val, key) => {
      return val;
    });
  }),

  addStudentNameFilter: function (name) {
    if (typeof name !== 'string') {
      return;
    }
    let trimmed = name.trim();
    let names = this.addedStudentNames;
    return trimmed.length > 1 && !names.includes(trimmed);
  },

  actions: {
    checkStatus: function () {
      if (this.isMatchingIncompleteError) {
        this.set('isMatchingIncompleteError', null);
      }
      let answers = this.answers;

      answers.forEach((ans) => {
        let isValid =
          this.utils.isNonEmptyArray(ans.students) ||
          this.utils.isNonEmptyArray(ans.studentNames);

        if (!isValid) {
          this.set('isReadyToReviewAnswers', false);
          return;
        }
        this.set('isReadyToReviewAnswers', true);
      });
    },
    next() {
      if (this.isReadyToReviewAnswers) {
        this.onProceed();
      } else {
        this.set('isMatchingIncompleteError', true);
        this.alert.showToast(
          'error',
          `Unmatched submission(s)`,
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

/*global _:false */
Encompass.ImportWorkStep4Component = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'import-work-step4',
  utils: Ember.inject.service('utility-methods'),

  addedStudentNames: [],

  init() {
    this._super(...arguments);
    this.set('newNameFilter', this.addStudentNameFilter.bind(this));
  },

  displayList: function() {
    if (!this.get('studentMap')) {
      return [];
    }
    return _.map(this.get('studentMap'), (val, key) => {
      return val;
    });
  }.property('studentMap'),


  addStudentNameFilter: function(name) {
    if (typeof name !== 'string') {
      return;
    }
    let trimmed = name.trim();
    let names = this.get('addedStudentNames');
    return trimmed.length > 1 && !names.includes(trimmed);
  },

  actions: {
    checkStatus: function() {
      if (this.get('isMatchingIncompleteError')) {
        this.set('isMatchingIncompleteError', null);
      }
      let answers = this.get('answers');
      console.log('checkstatus ran and answers are', answers);

      answers.forEach((ans) => {
        let isValid = this.get('utils').isNonEmptyArray(ans.students) || this.get('utils').isNonEmptyArray(ans.studentNames);

        if (!isValid) {
          this.set('isReadyToReviewAnswers', false);
          return;
        }
        this.set('isReadyToReviewAnswers', true);
      });
    },
    next() {
      if (this.get('isReadyToReviewAnswers')) {
        this.get('onProceed')();
      } else {
        this.set('isMatchingIncompleteError', true);
      }
    },
    back() {
      this.get('onBack')(-1);
    }
  }
});
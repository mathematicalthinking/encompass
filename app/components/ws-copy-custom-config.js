/*global _:false */
Encompass.WsCopyCustomConfigComponent = Ember.Component.extend({
  elementId: 'ws-copy-custom-config',
  answerStudents: Ember.computed.alias('mainOptions.answerOptions.byStudent.selectedValues'),
  utils: Ember.inject.service('utility-methods'),

  answerIds: Ember.computed.alias('customConfig.answerIds'),
  answerOptions: Ember.computed.alias('customConfig.answerOptions'),
  selectionOptions: Ember.computed.alias('customConfig.selectionOptions'),
  commentOptions: Ember.computed.alias('customConfig.commentOptions'),
  responseOptions: Ember.computed.alias('customConfig.responseOptions'),

  currentValue: 'answerOptions',

  mainOptions: {
    answerOptions: {
      label: 'Choose Submissions to Include',
      description: '',
      selectedValue: 'all',
      all: {
        label: 'All'
      },
      byStudent: {
        label: 'By Student',
        selectedValues: []
      },
    }
  },

  customConfig: {
    answerOptions: {
      all: true,
      answerIds: []
    },
    folderOptions: {
      includeStructureOnly: true,
      all: true,
      none: false,
      folderIds: [],
    },
    selectionOptions: {
      all: true,
      none: false,
      custom: false,
      selectionIds: []
    },
    commentOptions: {
      all: true,
      none: false,
      commentIds: []
    },
    responseOptions: {
      all: true,
      none: false,
      responseIds: []
    },

  },

  studentSelectOptions: function() {
    const options = [];
    const threads = this.get('submissionThreads');

    if (!threads) {
      return [];
    }
   threads.forEach((val, key) => {
      //key is student name,
      options.pushObject({
        label: key,
        value: key
      });
    });

   return options;
  }.property('submissionThreads'),

  submissionsFromStudents: function() {
    const threads = this.get('submissionThreads');
    const students = this.get('answerStudents');
    if (!threads || !this.get('utils').isNonEmptyArray(students) ) {
      return [];
    }
    return _.chain(students)
      .map(student => threads.get(student))
      .flatten()
      .value();
  }.property('answerStudents.[]', 'submissionThreads'),

  answerIdsFromStudents: function() {
    const subs = this.get('submissionsFromStudents');

    return subs.mapBy('answer.content.id');
  }.property('submissionsFromStudents'),

  actions: {
    updateMultiSelect(val, $item, propToUpdate) {
      if (!val) {
        return;
      }
      // removal
      if (_.isNull($item)) {
        this.get(propToUpdate).removeObject(val);
        return;
      }
      this.get(propToUpdate).pushObject(val);
    },
    updateCollectionOptions(val, propName) {
      const keys = ['all', 'none', 'custom'];

      if (!_.contains(keys, val)) {
        return;
      }
      const prop = this.get(propName);

      prop[val] = true;

      const without = _.without(keys, val);

      without.forEach((key) => {
        prop[key] = false;
      });

    }
  },


});
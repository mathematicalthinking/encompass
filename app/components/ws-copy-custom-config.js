/*global _:false */
Encompass.WsCopyCustomConfigComponent = Ember.Component.extend({
  elementId: 'ws-copy-custom-config',
  submissionStudents: [],
  utils: Ember.inject.service('utility-methods'),

  SubmissionIds: Ember.computed.alias('customConfig.SubmissionIds'),
  submissionOptions: Ember.computed.alias('customConfig.submissionOptions'),
  selectionOptions: Ember.computed.alias('customConfig.selectionOptions'),
  commentOptions: Ember.computed.alias('customConfig.commentOptions'),
  responseOptions: Ember.computed.alias('customConfig.responseOptions'),
  folderOptions: Ember.computed.alias('customConfig.folderOptions'),
  showStudentSubmissionInput: Ember.computed.equal('submissionOptions.byStudent', true),
  showCustomSubmissionViewer: Ember.computed.equal('submissionOptions.custom', true),
  customSubmissionIds: [],

  didReceiveAttrs() {
    console.log('did receive attra ws-copy-custom-config');
    this._super(...arguments);
  },

  formattedSubmissionOptions: function() {
    let submissionOptions = {
      all: true,
    };

    if (this.get('submissionOptions.all')) {
      return submissionOptions;
    }
    delete submissionOptions.all;

    if (this.get('submissionOptions.byStudent')) {
      submissionOptions.submissionIds = this.get('submissionsFromStudents').mapBy('id');

      return submissionOptions;
    }

    if (this.get('submissionOptions.custom')) {
      const customIds = this.get('customSubmissionIds');
      if (this.get('utils').isNonEmptyArray(customIds)) {
        submissionOptions.submissionIds = customIds;
      } else {
        submissionOptions.submissionIds = [];
      }
      return submissionOptions;
    }


  }.property('submissionOptions.all', 'submissionsFromStudents.[]'),

  formattedFolderOptions: function() {
    let folderOptions = {
      all: true,
      includeStructureOnly: true
    };

    if (this.get('folderOptions.all')) {
      if (this.get('folderOptions.includeStructureOnly')) {
        return folderOptions;
      }
      folderOptions.includeStructureOnly = false;
      return folderOptions;
    }
    delete folderOptions.all;
    delete folderOptions.includeStructureOnly;
    folderOptions.none = true;
    return folderOptions;

  }.property('folderOptions.all', 'folderOptions.none', 'folderOptions.IncludeStructureOnly'),

  formattedSelectionOptions: function() {
    let selectionOptions = {
      all: true
    };

    if (this.get('selectionOptions.all')) {
      return selectionOptions;
    }

    if (this.get('selectionOptions.none')) {
      selectionOptions.none = true;
      delete selectionOptions.all;

      return selectionOptions;
    }

    delete selectionOptions.all;
    selectionOptions.selectionIds = this.get('selectionsFromSubmissions').mapBy('id');

    return selectionOptions;
  }.property('selectionOptions.all', 'selectionOptions.none', 'selectionOptions.custom', 'selectionsFromSubmissions.[]'),

  formattedCommentOptions: function() {
    let commentOptions = {
      all: true
    };

    if (this.get('commentOptions.all')) {
      return commentOptions;
    }

    if (this.get('commentOptions.none')) {
      commentOptions.none = true;
      delete commentOptions.all;

      return commentOptions;
    }

    delete commentOptions.all;
    commentOptions.commentIds = this.get('commentsFromSelections').mapBy('id');

    return commentOptions;
  }.property('commentsFromSelections.[]', 'commentOptions.all', 'commentOptions.none', 'commentOptions.custom'),

  formattedResponseOptions: function() {
    let responseOptions = {
      all: true
    };

    if (this.get('responseOptions.all')) {
      return responseOptions;
    }

    if (this.get('responseOptions.none')) {
      responseOptions.none = true;
      delete responseOptions.all;

      return responseOptions;
    }
    delete responseOptions.all;
    responseOptions.responseIds = this.get('responsesFromSubmissions').mapBy('id');

    return responseOptions;
  }.property('responsesFromSubmissions.[]', 'responseOptions.all', 'responseOptions.none', 'responseOptions.custom'),

  formattedConfig: function() {

    return {
      submissionOptions: this.get('formattedSubmissionOptions'),
      folderOptions: this.get('formattedFolderOptions'),
      selectionOptions: this.get('formattedSelectionOptions'),
      commentOptions: this.get('formattedCommentOptions'),
      responseOptions: this.get('formattedResponseOptions')
    };
  }.property('formattedSubmissionOptions.@each{all,none,custom}', 'formattedSelectionOptions.@each{all,none,custom}', 'formattedCommentOptions.@each{all,none,custom}', 'formattedResponseOptions.@each{all,none,custom}', 'formattedFolderOptions.@each{all,none,includeStructureOnly}'),

  customConfig: {
    submissionOptions: {
      all: true,
      byStudent: false,
      custom: false,
      submissionIds: []
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
    if (this.get('submissionOptions.all')) {
      return this.get('workspace.submissions');
    }
    if (this.get('submissionOptions.custom')) {
      const customIds = this.get('customSubmissionIds');
      if (!this.get('utils').isNonEmptyArray(customIds)) {
        return [];
      }
      return this.get('workspace.submissions').filter((sub) => {
        return customIds.includes(sub.get('id'));
      });
    }
    const threads = this.get('submissionThreads');
    const students = this.get('submissionStudents');
    if (!threads || !this.get('utils').isNonEmptyArray(students) ) {
      return [];
    }
    return _.chain(students)
      .map(student => threads.get(student))
      .flatten()
      .value();
  }.property('submissionStudents.[]', 'customSubmissionIds.[]', 'submissionOptions.all', 'workspace.id', 'submissionOptions.custom', 'submissionOptions.byStudent', 'submissionThreads', 'doSelectAll', 'doDeselectAll'),

  selectionsFromSubmissions: function() {
    return this.get('workspace.selections').filter((selection) => {
      return this.get('submissionIdsFromStudents').includes(selection.get('submission.content.id'));
    });
  }.property('submissionsFromStudents.[]', 'customSubmissionIds.[]'),

  commentsFromSelections: function() {
    if (this.get('selectionOptions.none') === true) {
      return [];
    }

    return this.get('workspace.comments').filter((comment) => {
      return this.get('selectionsFromSubmissions').includes(comment.get('selection.content'));
    });
  }.property('selectionsFromSubmissions.[]', 'selectionOptions.none'),

  responsesFromSubmissions: function() {
    return this.get('workspace.responses').filter((response) => {
      return this.get('submissionsFromStudents').includes(response.get('submission.content'));
    });
  }.property('submissionsFromStudents.[]'),

  submissionIdsFromStudents: function() {
    const subs = this.get('submissionsFromStudents');

    return subs.mapBy('id');
  }.property('submissionsFromStudents.[]'),

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

    setSubmissions() {
      if (this.get('showStudentSubmissionInput')) {
        const submissionIds = this.get('submissionIdsFromStudents');
        if (this.get('utils').isNonEmptyArray(submissionIds)) {
          this.set('submissionIds', [...submissionIds]);
          this.set('showSelectionInputs', true);
          return;
        }
        this.set('noSubmissionssToCopy', true);
        return;
      }
      this.set('showSelectionInputs', true);

    },

    updateCollectionOptions(val, propName) {
      let keys = ['all', 'none', 'custom'];

      if (propName === 'submissionOptions') {
        keys = ['all', 'byStudent', 'custom'];
      }

      if (!_.contains(keys, val)) {
        return;
      }
      const propToToggle = `${propName}.${val}`;
      if (!this.get(propToToggle)) {
        this.set(propToToggle, true);
      }

      const without = _.without(keys, val);

      without.forEach((key) => {
        let prop = `${propName}.${key}`;
        if (this.get(prop)) {
          this.set(prop, false);
        }
      });

    },
    toggleIncludeStructureOnly() {
      this.toggleProperty('folderOptions.includeStructureOnly');
    },
    next(){
      this.get('onProceed')(this.get('formattedConfig'));
    },
    back() {
      this.get('onBack')(-1);
    },
    updateCustomSubs(id) {
      if (!this.get('utils').isNonEmptyArray(this.get('customSubmissionIds'))) {
        this.set('customSubmissionIds', []);
      }

      const customSubmissionIds = this.get('customSubmissionIds');

      const isIn = customSubmissionIds.includes(id);
      if (isIn) {
        // remove
        customSubmissionIds.removeObject(id);
      } else {
        //add
        customSubmissionIds.addObject(id);
      }

    },
    selectAllSubmissions: function() {
      this.set('customSubmissionIds', this.get('workspace.submissions').mapBy('id'));
    },
    deselectAllSubmissions: function() {
      this.set('customSubmissionIds', []);
    }
  },


});
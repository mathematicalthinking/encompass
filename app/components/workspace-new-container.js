import Component from '@ember/component';
import { computed } from '@ember/object';
import { equal, or } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import $ from 'jquery';
import moment from 'moment';
/*global _:false */
import { all } from 'rsvp';
import ErrorHandlingMixin from '../mixins/error_handling_mixin';

export default Component.extend(ErrorHandlingMixin, {
  elementId: 'workspace-new-container',
  showList: true,
  showGrid: false,
  toggleTrashed: false,
  toggleHidden: false,
  utils: service('utility-methods'),
  sortProperties: ['name'],
  answerToDelete: null,
  alert: service('sweet-alert'),
  selectedAnswers: [],
  currentStep: 1,
  showSubmissionViewer: equal('currentStep', 1),
  showWorkspaceSettingsMenu: equal('currentStep', 2),
  selectedFolderSet: null,
  selectedAssignment: null,
  selectedSection: null,
  selectedProblem: null,
  selectedTeacher: null,
  selectedStudents: [],
  dateRange: '',
  doIncludeRevisions: equal('selectedRevisionOption', 'All Revisions'),
  revisionsSelectOptions: ['All Revisions', 'Newest Only'],
  selectedRevisionOption: 'Newest Only',
  sortCriterion: {
    name: 'A-Z',
    sortParam: { student: 1 },
    doCollate: true,
    type: 'student',
  },
  sortOptions: {
    student: [
      { sortParam: null, icon: '' },
      {
        name: 'A-Z',
        sortParam: { student: 1 },
        doCollate: true,
        icon: 'fas fa-sort-alpha-down sort-icon',
        type: 'student',
      },
      {
        name: 'Z-A',
        sortParam: { student: -1 },
        doCollate: true,
        icon: 'fas fa-sort-alpha-up sort-icon',
        type: 'student',
      },
    ],
    createDate: [
      { sortParam: null, icon: '' },
      {
        id: 3,
        name: 'Newest',
        sortParam: { createDate: -1 },
        doCollate: false,
        icon: 'fas fa-arrow-down sort-icon',
        type: 'createDate',
      },
      {
        id: 4,
        name: 'Oldest',
        sortParam: { createDate: 1 },
        doCollate: false,
        icon: 'fas fa-arrow-up sort-icon',
        type: 'createDate',
      },
    ],
    revisions: [
      { sortParam: null, icon: '' },
      {
        name: 'Most',
        sortParam: { revisions: -1 },
        doCollate: false,
        icon: 'fas fa-arrow-down sort-icon',
        type: 'revisions',
      },
      {
        name: 'Fewest',
        sortParam: { revisions: 1 },
        doCollate: false,
        icon: 'fas fa-arrow-up sort-icon',
        type: 'revisions',
      },
    ],
    explanation: [
      { sortParam: null, icon: '' },
      {
        name: 'Longest',
        sortParam: { explanation: -1 },
        doCollate: false,
        icon: 'fas fa-arrow-down sort-icon',
        type: 'explanation',
      },
      {
        name: 'Shortest',
        sortParam: { explanation: 1 },
        doCollate: false,
        icon: 'fas fa-arrow-up sort-icon',
        type: 'explanation',
      },
    ],
    section: [
      { sortParam: null, icon: '' },
      {
        name: 'A-Z',
        sortParam: { section: 1 },
        doCollate: true,
        icon: 'fas fa-sort-alpha-down sort-icon',
        type: 'section',
      },
      {
        name: 'Z-A',
        sortParam: { section: -1 },
        doCollate: true,
        icon: 'fas fa-sort-alpha-up sort-icon',
        type: 'section',
      },
    ],
  },
  moreMenuOptions: [
    {
      label: 'Public',
      value: 'assign',
      action: 'addAnswer',
      icon: 'fas fa-list-ul',
    },
    {
      label: 'Delete',
      value: 'delete',
      action: 'deleteAnswer',
      icon: 'fas fa-trash',
    },
  ],

  doUseSearchQuery: or('isSearchingAnswers', 'isDisplayingSearchResults'),

  maximumAnswers: 1000,

  tooLargeRequestErrorMessage: computed(
    'isRequestTooLarge',
    'answersMetadata',
    function () {
      if (!this.isRequestTooLarge) {
        return;
      }
      let requestedCount = this.get('answersMetadata.total');
      return `Your filter criteria matches ${requestedCount} submissions. At this time we do not support new workspaces with greater than ${this.maximumAnswers} submissions. Please try modifying your criteria.`;
    }
  ),

  confirmLargeRequestMessage: computed('answersMetadata.total', function () {
    let requestedCount = this.get('answersMetadata.total');
    return `Your filter criteria matches ${requestedCount} submissions. Are you sure you want to proceed with viewing the submissions?`;
  }),

  listResultsMessage: computed(
    'criteriaTooExclusive',
    'isDisplayingSearchResults',
    'answers.@each.isTrashed',
    'isFetchingAnswers',
    'showLoadingMessage',
    'toggleTrashed',
    function () {
      let msg;
      if (this.isFetchingAnswers) {
        if (this.showLoadingMessage) {
          msg = 'Loading results... Thank you for your patience.';
        } else {
          msg = '';
        }
        return msg;
      }
      if (this.criteriaTooExclusive) {
        msg = 'No results found. Please try expanding your filter criteria.';
        return msg;
      }

      if (this.isDisplayingSearchResults) {
        let countDescriptor = 'submissions';
        let verb;
        let criterion = this.searchCriterion;
        if (criterion === 'all') {
          verb = 'contain';
        } else {
          verb = 'contains';
        }
        let total = this.get('answersMetadata.total');
        if (total === 1) {
          countDescriptor = 'submission';
          if (criterion === 'all') {
            verb = 'contains';
          }
        }
        let typeDescription = `whose ${criterion} ${verb}`;
        if (this.searchCriterion === 'all') {
          typeDescription = `that ${verb}`;
        }
        msg = `Based off your filter criteria, we found ${this.get(
          'answersMetadata.total'
        )} ${countDescriptor} ${typeDescription} "${this.searchQuery}"`;
        return msg;
      }
      msg = `${this.get('answersMetadata.total')} submissions found`;

      if (this.toggleTrashed) {
        msg = `${msg} - <strong>Displaying Trashed Submissions</strong>`;
      }

      return msg;
    }
  ),

  getMostRecentAnswers: function (answers) {
    if (!_.isArray(answers)) {
      return [];
    }
    const threads = {};

    answers
      .sortBy('student')
      .getEach('student')
      .uniq()
      .forEach((student) => {
        if (!threads[student]) {
          const answers = this.studentWork(student);
          threads[student] = answers;
        }
      });

    let results = [];
    Object.keys(threads).forEach((answers) => {
      results.addObject(threads[answers].get('lastObject'));
    });
    return results;
  },

  init: function () {
    this.getUserOrg().then((name) => {
      this.set('userOrgName', name);
    });
    this._super(...arguments);
  },

  getUserOrg() {
    return this.get('currentUser.organization').then((org) => {
      if (org) {
        return org.get('name');
      } else {
        this.alert.showModal(
          'warning',
          'You currently do not belong to any organization',
          'Please add or request an organization in order to get the best user experience',
          'Ok'
        );
        return 'undefined';
      }
    });
  },

  didReceiveAttrs() {
    // let attributes = ['organizations'];
    // for (let attr of attributes) {
    //   let prop = this.get(attr);
    //   let modelAttr = this.model[attr];
    //   if (!Ember.isEqual(prop, modelAttr)) {
    //     this.set(attr, modelAttr);
    //     let metaPropName = `${attr}Metadata`;
    //     let meta = modelAttr.get('meta');
    //     if (meta) {
    //       this.set(metaPropName, meta);
    //     }
    //   }
    // }
    this._super(...arguments);
  },

  didInsertElement() {
    let width = this.$().css('width');
    let widthNum = parseInt(width, 10);
    if (widthNum <= 430) {
      this.send('setGrid');
    }

    let doHideOutlet = this.doHideOutlet;
    if (_.isUndefined(doHideOutlet)) {
      this.set('doHideOutlet', this.get('model.hideOutlet'));
    }
    if (this.doHideOutlet === false) {
      this.$('#outlet').removeClass('hidden');
    }
    this._super(...arguments);
  },

  buildSearchBy: function () {
    let criterion = this.searchCriterion;
    let query = this.searchQuery;
    return {
      criterion,
      query,
    };
  },

  filteredAnswers: computed(
    'answers.@each.isTrashed',
    'toggleTrashed',
    function () {
      if (!this.answers) {
        return [];
      }
      const isTrashedVal = this.toggleTrashed;
      return this.answers.filterBy('isTrashed', isTrashedVal);
    }
  ),

  displayAnswers: computed(
    'filteredAnswers.[]',
    'doIncludeRevisions',
    'submissionThreads',
    function () {
      const answers = this.filteredAnswers;
      const doIncludeRevisions = this.doIncludeRevisions;
      if (answers) {
        if (doIncludeRevisions) {
          return answers;
        }
        const threads = this.submissionThreads;
        if (threads) {
          let results = [];
          Object.keys(threads).forEach((thread) => {
            // each thread is sorted array of student work (from earliest to latest)
            results.addObject(threads[thread].get('lastObject'));
          });
          return results;
        }
      }
      return [];
    }
  ),

  buildQueryParams: function (page, isTrashedOnly, didConfirmLargeRequest) {
    let params = {};

    if (isTrashedOnly) {
      params.isTrashedOnly = true;
      return params;
    }

    // let sortBy = this.buildSortBy();
    let filterBy = this.filterCriteria;

    if (this.criteriaTooExclusive) {
      // display message or just 0 results
      this.set('answers', []);
      this.set('answersMetadata', null);
      this.set('isFetchingAnswers', false);
      return;
    }
    params = {
      filterBy,
      didConfirmLargeRequest,
    };

    if (page) {
      params.page = page;
    }

    if (this.doUseSearchQuery) {
      let searchBy = this.buildSearchBy();
      params.searchBy = searchBy;
    }
    return params;
  },

  getAnswers: function (
    page,
    isTrashedOnly = false,
    isHiddenOnly = false,
    didConfirmLargeRequest = false
  ) {
    this.set('isFetchingAnswers', true);
    this.set('selectedAnswers', []);

    let queryParams = this.buildQueryParams(
      page,
      isTrashedOnly,
      didConfirmLargeRequest
    );

    if (this.criteriaTooExclusive) {
      if (this.isFetchingAnswers) {
        this.set('isFetchingAnswers', false);
      }
      return;
    }

    this.store
      .query('answer', queryParams)
      .then((results) => {
        this.removeMessages('answerLoadErrors');
        this.set('answers', results);

        this.set('answersMetadata', results.get('meta'));
        this.set('isFetchingAnswers', false);

        let isSearching = this.isSearchingAnswers;

        if (isSearching) {
          this.set('isDisplayingSearchResults', true);
          this.set('isSearchingAnswers', false);
        }

        if (this.searchByRelevance) {
          this.set('searchByRelevance', false);
        }

        if (this.isChangingPage) {
          this.set('isChangingPage', false);
        }

        if (isHiddenOnly) {
          console.log('getAnswers and isHiddenOnly is', isHiddenOnly);
        }
        if (results.get('meta.areTooManyAnswers')) {
          // should only be returned for non admins
          this.set('isRequestTooLarge', true);
          return;
        }
        if (results.get('meta.doConfirmCriteria')) {
          let prompt = this.confirmLargeRequestMessage;
          return this.alert
            .showModal('warning', prompt, '', 'Proceed')
            .then((result) => {
              if (result.value) {
                // resend request with didConfirmFlag true
                this.send('triggerFetch', false, false, true);
              }
            });
        }

        // check if ned to confirm large request
      })
      .catch((err) => {
        this.handleErrors(err, 'answerLoadErrors');
        this.set('isFetchingAnswers', false);
      });
  },

  currentAsOf: computed(function () {
    return moment(this.since).format('H:mm');
  }),

  listFilter: 'all',

  sortDisplayList: function (list) {
    if (!list) {
      return;
    }
    // TODO: robust sorting options

    // for now just show most recently created at top
    return list.sortBy('lastModifiedDate').reverse();
  },
  submissionThreads: computed('filteredAnswers.[]', function () {
    if (!this.filteredAnswers) {
      return [];
    }
    const threads = {};
    this.filteredAnswers
      .sortBy('student')
      .getEach('student')
      .uniq()
      .forEach((student) => {
        if (!threads[student]) {
          const answers = this.studentWork(student);
          threads[student] = answers;
        }
      });
    return threads;
  }),

  studentWork: function (student) {
    return this.answers.filterBy('student', student).sortBy('createDate');
  },
  sortedAnswers: computed('displayAnswers.[]', 'sortCriterion', function () {
    let sortParam = this.get('sortCriterion.sortParam');
    const defaultSorted = this.displayAnswers;
    if (!sortParam) {
      // default to alphabetical
      return defaultSorted;
    }
    let field = _.keys(sortParam)[0];
    let direction = sortParam[field];

    if (field === 'explanation') {
      let ascending = defaultSorted.sortBy('explanation.length');
      if (direction === 1) {
        return ascending;
      }
      return ascending.reverse();
    }

    if (field === 'createDate') {
      let ascending = defaultSorted.sortBy('createDate');
      if (direction === 1) {
        return ascending;
      }
      return ascending.reverse();
    }

    if (field === 'revisions') {
      let ascending = _.sortBy(defaultSorted, (answer) => {
        let student = answer.get('student');
        let revisionCount = this.submissionThreads[student].get('length');
        return revisionCount;
      });
      if (direction === 1) {
        return ascending;
      }
      return ascending.reverse();
    }
    if (field === 'student') {
      let ascending = defaultSorted.sortBy('student');
      if (direction === 1) {
        return ascending;
      }
      return ascending.reverse();
    }
    return defaultSorted;
  }),

  actions: {
    showModal: function (answer) {
      this.set('answerToDelete', answer);
      this.alert
        .showModal(
          'warning',
          'Are you sure you want to delete this submission?',
          null,
          'Yes, delete it'
        )
        .then((result) => {
          if (result.value) {
            this.send('trashAnswer', answer);
          }
        });
    },
    refreshList() {
      let isTrashedOnly = this.toggleTrashed;
      let isHiddenOnly = this.toggleHidden;
      this.getAnswers(null, isTrashedOnly, isHiddenOnly);
    },
    toggleFilter: function (key) {
      if (key === this.listFilter) {
        return;
      }
      this.set('listFilter', key);
    },
    triggerShowTrashed() {
      this.send('triggerFetch', this.toggleTrashed);
    },
    triggerShowHidden() {
      this.send('triggerFetch', this.toggleTrashed, this.toggleHidden);
    },
    clearSearchResults: function () {
      this.set('searchQuery', null);
      this.set('searchInputValue', null);
      this.set('isDisplayingSearchResults', false);
      this.send('triggerFetch');
    },
    updatePageResults(results) {
      this.set('answers', results);
    },

    searchAnswers(val, criterion) {
      if (criterion === 'all') {
        this.set('searchByRelevance', true);
      }
      this.set('searchQuery', val);
      this.set('searchCriterion', criterion);
      this.set('isSearchingAnswers', true);
      this.send('triggerFetch');
    },
    initiatePageChange: function (page) {
      this.set('isChangingPage', true);
      let isTrashedOnly = this.toggleTrashed;
      let isHiddenOnly = this.toggleHidden;
      this.getAnswers(page, isTrashedOnly, isHiddenOnly);
    },

    updateFilter: function (id, checked) {
      let filter = this.filter;
      let keys = Object.keys(filter);
      if (!keys.includes(id)) {
        return;
      }
      filter[id] = checked;
      this.send('triggerFetch');
    },
    updateSortCriterion(criterion) {
      this.set('sortCriterion', criterion);
    },
    triggerFetch(
      isTrashedOnly = false,
      isHiddenOnly = false,
      didConfirmLargeRequest = false
    ) {
      for (let prop of ['criteriaTooExclusive']) {
        if (this.get(prop)) {
          this.set(prop, null);
        }
      }

      this.getAnswers(
        null,
        isTrashedOnly,
        isHiddenOnly,
        didConfirmLargeRequest
      );
    },
    setGrid: function () {
      $('#layout-view').addClass('grid-view');
      this.set('showGrid', true);
      this.set('showList', false);
    },
    setList: function () {
      $('#layout-view').removeClass('grid-view');
      this.set('showList', true);
      this.set('showGrid', false);
    },

    toggleMenu: function () {
      $('#filter-list-side').toggleClass('collapse');
      $('#arrow-icon').toggleClass('fa-rotate-180');
      $('#filter-list-side').addClass('animated slideInLeft');
    },
    setFilterCriteria(criteria) {
      if (this.utils.isNonEmptyObject(criteria)) {
        this.set('filterCriteria', criteria);
        this.send('triggerFetch');
      }
    },
    updateSelectedAnswers(answer, isChecked) {
      // if isChecked is false, add answer to selected Answers
      // if true remove
      if (!answer) {
        return;
      }
      let isShowingRevisions = this.doIncludeRevisions;
      // if showing revisions, only add or remove selected answer
      // otherwise add or remove all revisions
      if (isChecked === true) {
        if (isShowingRevisions) {
          this.selectedAnswers.removeObject(answer);
          return;
        }
        let student = answer.get('student');
        let revisions = this.submissionThreads[student];
        this.selectedAnswers.removeObjects(revisions);
      }
      if (isChecked === false) {
        if (isShowingRevisions) {
          this.selectedAnswers.addObject(answer);
          return;
        }
        let student = answer.get('student');
        let revisions = this.submissionThreads[student];
        this.selectedAnswers.addObjects(revisions);
      }
    },
    toggleIncludeRevisions() {
      this.toggleProperty('doIncludeRevisions');
    },
    toggleCheckAllAnswers(e) {
      // if is checked, user just checked box, so select all
      let isChecked = e.target.checked;

      const utils = this.utils;
      let answers = this.filteredAnswers;
      if (!utils.isNonEmptyArray(answers)) {
        return;
      }
      if (isChecked === false) {
        this.set('selectedAnswers', []);
      }
      if (isChecked === true) {
        this.selectedAnswers.addObjects(answers);
      }
    },
    toSettingsConfig() {
      const answers = this.selectedAnswers;
      if (!this.utils.isNonEmptyArray(answers)) {
        return;
      }
      this.set('currentStep', 2);
    },
    toSearchFilter() {
      if (this.createWorkspaceError) {
        this.set('createWorkspaceError', null);
      }
      this.set('currentStep', 1);
    },

    createWorkspace(settings) {
      if (this.createWorkspaceError) {
        this.set('createWorkspaceError', null);
      }
      const utils = this.utils;
      let answers = this.selectedAnswers;

      if (!utils.isNonEmptyObject(settings)) {
        return;
      }

      const {
        requestedName,
        owner,
        mode,
        folderSet,
        permissionObjects,
        submissionSettings,
      } = settings;
      if (utils.isNonEmptyArray(permissionObjects)) {
        permissionObjects.forEach((obj) => {
          if (obj.user && obj.user.get('id')) {
            obj.user = obj.user.get('id');
          }
        });
      }
      if (!utils.isNonEmptyArray(answers)) {
        return;
      }

      if (submissionSettings === 'mostRecent') {
        // only include most recent submission
        answers = this.getMostRecentAnswers(answers);
      }
      let criteria = {
        answers,
        requestedName,
        owner,
        mode,
        folderSet,
        permissionObjects,
        createdBy: this.currentUser,
      };

      const encWorkspaceRequest = this.store.createRecord(
        'encWorkspaceRequest',
        criteria
      );
      this.set('isRequestInProgress', true);
      encWorkspaceRequest
        .save()
        .then((res) => {
          this.set('isRequestInProgress', false);
          if (res.get('isEmptyAnswerSet')) {
            this.set('isEmptyAnswerSet', true);
            $('.error-box').show();
            return;
          }
          if (res.get('createWorkspaceError')) {
            this.set('createWorkspaceError', res.get('createWorkspaceError'));
            return;
          }
          this.alert.showToast(
            'success',
            'Workspace Created',
            'bottom-end',
            3000,
            false,
            null
          );
          //Get the created workspaceId from the res
          let workspaceId = res.get('createdWorkspace').get('id');

          this.sendAction('toWorkspaces', workspaceId);
        })
        .catch((err) => {
          this.set('isRequestInProgress', false);

          this.handleErrors(err, 'wsRequestErrors', encWorkspaceRequest);
          return;
        });
    },

    restoreAllSelected() {
      const selectedAnswers = this.selectedAnswers;
      if (!Array.isArray(selectedAnswers) || selectedAnswers.length === 0) {
        return;
      }

      const count = selectedAnswers.length;

      let noun = 'submissions';
      let modifier = 'These';

      if (count === 1) {
        noun = 'submission';
        modifier = 'This';
      }

      this.alert
        .showModal(
          'warning',
          `Are you sure you want to restore ${count} ${noun}?`,
          `${modifier} ${noun} will be searchable by other users`,
          'Yes'
        )
        .then((result) => {
          if (result.value) {
            all(
              selectedAnswers.map((answer) => {
                answer.set('isTrashed', false);
                return answer.save();
              })
            )
              .then(() => {
                this.alert.showToast(
                  'success',
                  `${count} ${noun} Restored`,
                  'bottom-end',
                  3000,
                  false,
                  null
                );
                this.set('selectedAnswers', []);
              })
              .catch(() => {
                this.alert.showToast(
                  'error',
                  `Sorry, an error occurred`,
                  'bottom-end',
                  3000,
                  false,
                  null
                );
              });
          }
        });
    },
  },
});

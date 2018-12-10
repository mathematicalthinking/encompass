/*global _:false */
Encompass.WorkspaceNewContainerComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {
  elementId: 'workspace-new-container',
  showList: true,
  showGrid: false,
  toggleTrashed: false,
  toggleHidden: false,
  utils: Ember.inject.service('utility-methods'),
  sortProperties: ['name'],
  answerToDelete: null,
  alert: Ember.inject.service('sweet-alert'),
  selectedAnswerIds: [],
  doIncludeRevisions: false,

  searchOptions: ['all'],
  searchCriterion: 'all',
  sortCriterion: { name: 'A-Z', sortParam: { student: 1 }, doCollate: true, type: 'student' },
  sortOptions: {
    student: [
      {sortParam: null, icon: 'fas fa-minus'},
      { name: 'A-Z', sortParam: { student: 1 }, doCollate: true, icon:"fas fa-sort-alpha-down sort-icon", type: 'student' },
      { name: 'Z-A', sortParam: { student: -1 }, doCollate: true, icon:"fas fa-sort-alpha-up sort-icon", type: 'student' },
    ],
    createDate: [
      { sortParam: null, icon: 'fas fa-minus'},
      {id: 3, name: 'Newest', sortParam: { createDate: -1}, doCollate: false, icon: "fas fa-arrow-down sort-icon", type: 'createDate' },
      {id: 4, name: 'Oldest', sortParam: { createDate: 1}, doCollate: false, icon:"fas fa-arrow-up sort-icon", type: 'createDate'}
    ],
    revision: [
      { sortParam: null, icon: 'fas fa-minus'},
      { name: 'Most', sortParam: { revisions: -1}, doCollate: false, icon: "fas fa-arrow-down sort-icon", type: 'revisions' },
      { name: 'Fewest', sortParam: { revisions: 1}, doCollate: false, icon:"fas fa-arrow-up sort-icon", type: 'revisions'}
    ],
    explanation: [
      { sortParam: null, icon: 'fas fa-minus'},
      { name: 'Longest', sortParam: { explanation: -1}, doCollate: false, icon: "fas fa-arrow-down sort-icon", type: 'explanation' },
      { name: 'Shortest', sortParam: { explanation: 1}, doCollate: false, icon:"fas fa-arrow-up sort-icon", type: 'explanation'}
    ],
    section: [
      {sortParam: null, icon: 'fas fa-minus'},
      { name: 'A-Z', sortParam: { section: 1 }, doCollate: true, icon:"fas fa-sort-alpha-down sort-icon", type: 'section' },
      { name: 'Z-A', sortParam: { section: -1 }, doCollate: true, icon:"fas fa-sort-alpha-up sort-icon", type: 'section' },
    ],

  },

  moreMenuOptions: [
    {label: 'Copy', value: 'copy', action: 'copyAnswer', icon: 'fas fa-copy'},
    {label: 'Assign', value: 'assign', action: 'addAnswer', icon: 'fas fa-list-ul'},
    {label: 'Hide', value: 'hide', action: 'hideAnswer', icon: 'fas fa-archive'},
    {label: 'Delete', value: 'delete', action: 'deleteAnswer', icon: 'fas fa-trash'},
  ],

  doUseSearchQuery: Ember.computed.or('isSearchingAnswers', 'isDisplayingSearchResults'),

  listResultsMessage: function() {
    let msg;
    // let userOrgName = this.get('userOrgName');
    if (this.get('isFetchingAnswers')) {
      if (this.get('showLoadingMessage')) {
        msg = 'Loading results... Thank you for your patience.';

      } else {
        msg = '';
      }
      return msg;
    }
    if (this.get('criteriaTooExclusive')) {
      msg = 'No results found. Please try expanding your filter criteria.';
      return msg;
    }

    if (this.get('isDisplayingSearchResults')) {
      let countDescriptor = 'submissions';
      let verb;
      let criterion = this.get('searchCriterion');
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
      if (this.get('searchCriterion') === 'all') {
        typeDescription = `that ${verb}`;
      }
      msg = `Based off your filter criteria, we found ${this.get('answersMetadata.total')} ${countDescriptor} ${typeDescription} "${this.get('searchQuery')}"`;
      return msg;
    }
    msg = `${this.get('answersMetadata.total')} submissions found`;

    let toggleTrashed = this.get('toggleTrashed');

    if (toggleTrashed) {
      msg = `${msg} - <strong>Displaying Trashed Submissions</strong>`;
    }

    return msg;

  }.property('criteriaTooExclusive', 'isDisplayingSearchResults', 'answers.@each.isTrashed', 'isFetchingAnswers', 'showLoadingMessage'),


  init: function() {
    this.getUserOrg()
    .then((name) => {
      this.set('userOrgName', name);
    });
    this._super(...arguments);
  },

  getUserOrg () {
   return this.get('currentUser.organization').then((org) => {
     if (org) {
       return org.get('name');
     } else {
       this.get('alert').showModal('warning', 'You currently do not belong to any organization', 'Please add or request an organization in order to get the best user experience', 'Ok');
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

    let doHideOutlet = this.get('doHideOutlet');
    if (_.isUndefined(doHideOutlet)) {
      this.set('doHideOutlet', this.get('model.hideOutlet') );

    }
    if (this.get('doHideOutlet') === false) {
      this.$('#outlet').removeClass('hidden');
    }
    this._super(...arguments);
  },

  buildSortBy: function() {
    if (this.get('searchByRelevance')) {
      return {
        sortParam: {
          score: { $meta: "textScore" }
        },
        doCollate: false,
        byRelevance: true
      };
    }

    let criterion = this.get('sortCriterion');
    if (!criterion) {
      return { title: 1, doCollate: true };
    }
    let { sortParam, doCollate } = criterion;
    return {
      sortParam,
      doCollate
    };
  },

  buildSearchBy: function() {
    let criterion = this.get('searchCriterion');
    let query = this.get('searchQuery');
    return {
      criterion,
      query
    };
  },

  buildFilterBy: function() {
    let primaryFilterValue = this.get('primaryFilterValue');
    let isPdadmin = this.get('currentUser.accountType') === "P";
    let filterBy;

    if (primaryFilterValue === 'mine') {
      filterBy = this.buildMineFilter();
    }

    if (primaryFilterValue === 'collab') {
      filterBy = this.buildCollabFilter();
    }

    if (primaryFilterValue === 'everyone') {
      filterBy = this.buildPublicFilter();
    }

    if (primaryFilterValue === 'myOrg') {
      filterBy = this.buildMyOrgFilter();
    }

    if (primaryFilterValue === 'all') {
      filterBy = this.buildAllFilter();
    }
    if (_.isUndefined(filterBy) || _.isNull(filterBy)) {
      filterBy = {};
    }
    // primary public filter should disable privacy setting dropdown?
    if (primaryFilterValue === 'everyone') {
      filterBy.mode = {$in: ['public']};
    } else if (primaryFilterValue === 'myOrg') {
      if (isPdadmin) {
        let mode = this.get('modeFilter');
        filterBy.mode = mode;
      } else {
        filterBy.mode = { $in: ['org'] };
      }
    } else {
      let mode = this.get('modeFilter');
      filterBy.mode = mode;
    }

    return filterBy;
  },

  displayAnswers: function () {
    const answers = this.get('answers');
    const doIncludeRevisions = this.get('doIncludeRevisions');
    if (answers) {
      if (doIncludeRevisions) {
        return answers.rejectBy('isTrashed');
      }
      const threads = this.get('submissionThreads');
      if (threads) {
        let results = [];
        threads.forEach((thread) => {
          results.addObject(thread.get('firstObject'));
        });
        return results;
      }
    }
    return [];
  }.property('answers.@each.isTrashed', 'doIncludeRevisions', 'submissionThreads'),

  buildQueryParams: function(page, isTrashedOnly) {
    let params = {};
    if (page) {
      params.page = page;
    }

    if (isTrashedOnly) {
      params.isTrashedOnly = true;
      return params;
    }

    let sortBy = this.buildSortBy();
    let filterBy = this.get('filterCriteria');

    if (this.get('criteriaTooExclusive') ) {
      // display message or just 0 results
      this.set('answers', []);
      this.set('answersMetadata', null);
      this.set('isFetchingAnswers', false);
      return;
    }
    params = {
      sortBy,
      filterBy
    };

    if (page) {
      params.page = page;
    }

    if (this.get('doUseSearchQuery')) {
      let searchBy = this.buildSearchBy();
      params.searchBy = searchBy;
    }
    return params;
  },

  handleLoadingMessage: function() {
    const that = this;
    if (!this.get('isFetchingAnswers')) {
      this.set('showLoadingMessage', false);
      return;
    }
    Ember.run.later(function() {
      if (that.isDestroyed || that.isDestroying || !that.get('isFetchingAnswers')) {
        return;
      }
      that.set('showLoadingMessage', true);
    }, 300);
  }.observes('isFetchingAnswers'),

  getAnswers: function(page, isTrashedOnly=false, isHiddenOnly=false, ) {
    this.set('isFetchingAnswers', true);
    let queryParams = this.buildQueryParams(page, isTrashedOnly);
    console.log('queryParams', queryParams);
    if (this.get('criteriaTooExclusive')) {
      if (this.get('isFetchingAnswers')) {
        this.set('isFetchingAnswers', false);
      }
      return;
    }

    this.store.query('answer',
      queryParams
    ).then((results) => {
      console.log('answer results', results);
      this.removeMessages('answerLoadErrors');
      this.set('answers', results);
      this.set('answersMetadata', results.get('meta'));
      this.set('isFetchingAnswers', false);


      let isSearching = this.get('isSearchingAnswers');

      if (isSearching) {
        this.set('isDisplayingSearchResults', true);
        this.set('isSearchingAnswers', false);
      }

      if (this.get('searchByRelevance')) {
        this.set('searchByRelevance', false);
      }

      if (this.get('isChangingPage')) {
        this.set('isChangingPage', false);
      }

      if (isHiddenOnly) {
        console.log('getAnswers and isHiddenOnly is', isHiddenOnly);
      }
    }).catch((err) => {
      this.handleErrors(err, 'answerLoadErrors');
      this.set('isFetchingAnswers', false);

    });
  },

  currentAsOf: function() {
    return moment(this.get('since')).format('H:mm');
  }.property(),

  listFilter: 'all',

  sortDisplayList: function(list) {
    if (!list) {
      return;
    }
    // TODO: robust sorting options

    // for now just show most recently created at top
    return list.sortBy('lastModifiedDate').reverse();

  },
  submissionThreads: function() {
    if (!this.get('answers')) {
      return [];
    }
    const threads = Ember.Map.create();

    this.get('answers')
      .sortBy('student')
      .getEach('student')
      .uniq()
      .forEach((student) => {
        if(!threads.has(student)) {
          const answers = this.studentWork(student);
          threads.set(student, answers);
        }
      });
    return threads;
  }.property('answers.[]'),

  studentWork: function(student) {
    return this.get('answers')
      .filterBy('student', student)
      .sortBy('createDate');

  },
  sortedAnswers: function() {
    let sortParam = this.get('sortCriterion.sortParam');
    if (!sortParam) {
      // default to alphabetical
      return this.get('displayAnswers');
    }
    let field = _.keys(sortParam)[0];
    let direction = sortParam[field];

    if (field === 'explanation') {
      let ascending = this.get('displayAnswers').sortBy('explanation.length');
      if (direction === 1) {
        return ascending;
      }
      return ascending.reverse();
    }

    if (field === 'createDate') {
      let ascending = this.get('displayAnswers').sortBy('createDate');
      if (direction === 1) {
        return ascending;
      }
      return ascending.reverse();
    }

    if (field === 'revisions') {
      let ascending = _.sortBy(this.get('displayAnswers'), (answer) => {
        let student = answer.get('student');
        let revisionCount = this.get('submissionThreads').get(student).get('length');
        return revisionCount;
      });
      if (direction === 1) {
        return ascending;
      }
      return ascending.reverse();
    }
    return this.get('displayAnswers');

  }.property('displayAnswers.[]', 'sortCriterion'),

  // displayList: function() {
  //   const filterKey = {
  //     all: 'allAnswers',
  //   };

  //   const filter = this.get('listFilter');

  //   if (_.isUndefined(filter) || _.isUndefined(filterKey[filter])) {
  //     return this.get('answers').rejectBy('isTrashed');
  //   }

  //   const listName = filterKey[filter];
  //   let displayList = this.get(listName);
  //   let sorted = this.sortDisplayList(displayList);

  //   // if (sorted) {
  //   //   this.set('displayList', sorted);
  //   //   return sorted;
  //   // } else {
  //   //   this.set('displayList', this.get(listName));
  //   // }
  //   return sorted;

  // }.property('listFilter', 'answers.@each.isTrashed'),

  // setAllAnswers: function() {
  //   this.set('allAnswers', this.get('answers').rejectBy('isTrashed'));
  // }.observes('answers.@each.isTrashed'),

  actions: {
    showModal: function(answer) {
      this.set('answerToDelete', answer);
      this.get('alert').showModal('warning', 'Are you sure you want to delete this submission?', null, 'Yes, delete it')
      .then((result) => {
        if (result.value) {
          this.send('trashAnswer', answer);
        }
      });
    },
    refreshList() {
      let isTrashedOnly = this.get('toggleTrashed');
      let isHiddenOnly = this.get('toggleHidden');
      this.getAnswers(null, isTrashedOnly, isHiddenOnly);
    },
    toggleFilter: function(key) {
      if (key === this.get('listFilter')) {
        return;
      }
      this.set('listFilter', key);
    },
    triggerShowTrashed() {
      this.send('triggerFetch', this.get('toggleTrashed'));
    },
    triggerShowHidden() {
      this.send('triggerFetch', this.get('toggleHidden'));
    },
    clearSearchResults: function() {
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
    initiatePageChange: function(page) {
      this.set('isChangingPage', true);
      let isTrashedOnly = this.get('toggleTrashed');
      let isHiddenOnly = this.get('toggleHidden');
      this.getAnswers(page, isTrashedOnly, isHiddenOnly);
    },

    updateFilter: function(id, checked) {
      let filter = this.get('filter');
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
    triggerFetch(isTrashedOnly=false, isHiddenOnly=false) {
      for (let prop of ['criteriaTooExclusive']) {
        if (this.get(prop)) {
          this.set(prop, null);
        }
      }

      this.getAnswers(null, isTrashedOnly, isHiddenOnly);
    },
    setGrid: function () {
      $('#layout-view').addClass('grid-view');
      this.set('showGrid', true);
      this.set('showList', false);
    },
    setList: function() {
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
      if (this.get('utils').isNonEmptyObject(criteria)) {
        this.set('filterCriteria', criteria);
        this.send('triggerFetch');
      }
    },
    updateSelectedAnswerIds(answerId) {

    },
    toggleIncludeRevisions() {
      this.toggleProperty('doIncludeRevisions');
    }
  }
});
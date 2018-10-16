Encompass.ProblemListContainerComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {
  elementId: 'problem-list-container',
  searchOptions: ['title', 'text', 'category'],
  searchCriterion: 'title',
  sortCriterion: { id: 1, name: 'A-Z', sortParam: { title: 1 } },
  sortOptions: [
    {id: 1, name: 'A-Z', sortParam: { title: 1 }, doCollate: true },
    {id: 2, name: 'Z-A', sortParam: { title: -1 }, doCollate: true },
    {id: 3, name: 'Newest', sortParam: { createDate: -1}, doCollate: false },
    {id: 4, name: 'Oldest', sortParam: { createDate: 1}, doCollate: false }
  ],
  selectedCreators: [],

  init: function() {
    this.configureFilter();
    this._super(...arguments);
  },

  didReceiveAttrs: function() {
    let attributes = ['problems', 'sections', 'organizations'];

    for (let attr of attributes) {
      let prop = this.get(attr);
      let modelAttr = this.model[attr];
      if (!Ember.isEqual(prop, modelAttr)) {
        this.set(attr, modelAttr);
        let metaPropName = `${attr}Metadata`;
        let meta = modelAttr.get('meta');
        if (meta) {
          this.set(metaPropName, meta);
        }
      }
    }
    if (!this.get('addCategoriesTypeahead')) {
      this.set('addCategoriesTypeahead', this.getAddableCategories.call(this));
    }
    if (!this.get('addUserTypeahead')) {
      this.set('addUserTypeahead', this.getAddableUsers.call(this));
    }
  },

  configureFilter: function() {
    let filter = {
      everyone: true,
      organization: true,
      mine: true,
      creator: ''
    };

    let isAdmin = this.get('currentUser.isAdmin');
    let isPdAdmin = this.get('currentUser.isPdAdmin');

    if (isPdAdmin) {
      filter.unshared = false;
      this.set('filter', filter);
      return;
    }

    if (isAdmin) {
      filter.privatePows = false;
      filter.unshared = false;
      filter.creator = '';
    }
    this.set('filter', filter);
  },

  doUseSearchQuery: Ember.computed.or('isSearchingProblems', 'isDisplayingSearchResults'),

  buildPrivacySettingFilter: function() {
    if (!this.get('filter')) {
      return;
    }
    let filter = this.get('filter');

    let { everyone, organization, unshared } = filter;
    if (!everyone && !organization && !unshared) {
      return {$nin: ['E', 'O', 'M']};
    }

    let included = [];

    if (everyone) {
      included.push('E');
    }
    if (organization) {
      included.push('O');
    }
    if (unshared) {
      included.push('M');
    }
    return {$in: included};
  },

  buildCreatedByFilter: function() {
    if (!this.get('filter')) {
      return;
    }

    let filter = this.get('filter');
    let { mine } = filter;

    //should these be either or?
    if (mine) {
      let id = this.get('currentUser.id');
      return id;
    }

    // TODO: add creator filter
  },

  buildSortBy: function() {
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
    let filter = this.get('filter');
    let privacySetting = this.buildPrivacySettingFilter();
    let createdByFilter = this.buildCreatedByFilter();
    let privatePows = filter.privatePows;
    let filterBy = {
      privacySetting
    };
    if (createdByFilter) {
      filterBy.createdBy = createdByFilter;
    }

    if (privatePows) {
      filterBy.privatePows = true;
    }
    return filterBy;

  },

  displayProblems: function() {
    let problems = this.get('problems');
    if (problems) {
      return problems.rejectBy('isTrashed');
    }
  }.property('problems.@each.isTrashed'),

  buildQueryParams: function(page) {
    let sortBy = this.buildSortBy();
    let filterBy = this.buildFilterBy();

    let params = {
      sortBy,
      filterBy
    };

    if (this.get('doUseSearchQuery')) {
      let searchBy = this.buildSearchBy();
      params.searchBy = searchBy;
    }

    if (page) {
      params.page = page;
    }

    return params;
  },

  getProblems: function(page) {
    let queryParams = this.buildQueryParams(page);

    // let doFilterByCategories = this.get('doFilterByCategories');
    // if (!doFilterByCategories) {
    //  delete filter.categories;
    // }

    this.store.query('problem',
      queryParams
    ).then((results) => {
      this.removeMessages('problemLoadErrors');
      this.set('problems', results);
      this.set('problemsMetadata', results.get('meta'));

      let isSearching = this.get('isSearchingProblems');
      if (isSearching) {
        this.set('isDisplayingSearchResults', true);
        this.set('isSearchingProblems', false);
      }

      if (this.get('isChangingPage')) {
        this.set('isChangingPage', false);
      }
    }).catch((err) => {
      this.handleErrors(err, 'problemLoadErrors');
    });
  },
  getAddableCategories: function() {
    const store = this.get('store');
    const syncCategories = this.get('syncCategories');
    let ret = function (query, syncCb, asyncCb) {
      if (query.length === 0 && syncCategories) {
        return asyncCb(syncCategories.toArray());
      }
      let text = query.replace(/\s+/g, "");

      return store.query('category', {
        searchBy: {
          identifier: text
        }
      }).then((categories) => {
          return asyncCb(categories.toArray());
        })
        .catch((err) => {
          this.handleErrors(err, 'queryErrors');
        });
    };
    return ret.bind(this);

  },
  getAddableUsers: function () {
    const store = this.get('store');

    let ret = function (query, syncCb, asyncCb) {
      // if (doGetTeachers) {
      //   selectedUsers = this.get('teacherList');
      // } else {
      //   selectedUsers = this.get('studentList');
      // }
      let selectedUsers = this.get('selectedCreators');
      let text = query.replace(/\W+/g, "");
      return store.query('user', {
          usernameSearch: text,
        }).then((users) => {
          if (!users) {
            return [];
          }
          // if (doGetTeachers) {
          //   users = users.rejectBy('accountType', 'S');
          // }
          let filtered = users.filter((user) => {
            return !selectedUsers.includes(user);
          });
          return asyncCb(filtered.toArray());
        })
        .catch((err) => {
          this.handleErrors(err, 'queryErrors');
        });
    };
    return ret.bind(this);
  },

  actions: {
    clearSearchResults: function() {
      this.set('searchQuery', null);
      this.set('searchInputValue', null);
      this.set('isDisplayingSearchResults', false);
      this.getProblems();
    },
    updatePageResults(results) {
      this.set('problems', results);
    },

    searchProblems(val, criterion) {
      this.set('searchQuery', val);
      this.set('searchCriterion', criterion);
      this.set('isSearchingProblems', true);
      this.getProblems();
    },
    initiatePageChange: function(page) {
      this.set('isChangingPage', true);
      this.getProblems(page);
    },
    addCategory: function(cat) {
      let filterCategories = this.get('filter.categories');
      filterCategories.addObject(cat);
    },
    removeCategory: function(cat) {
      let filterCategories = this.get('filter.categories');
      filterCategories.removeObject(cat);
    },
    updateFilter: function(id, checked) {
      let filter = this.get('filter');
      let keys = Object.keys(filter);
      if (!keys.includes(id)) {
        return;
      }
      filter[id] = checked;
      this.getProblems();
    },
    updateSortCriterion(criterion) {
      console.log('crit', criterion);
      this.set('sortCriterion', criterion);
      this.getProblems();
    }
  }
});
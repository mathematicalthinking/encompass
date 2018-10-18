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
  privacySettingOptions: [
    {id: 1, name: 'All', value: ['M', 'O', 'E']},
    {id: 2, name: 'Public', value: ['O', 'E']},
    {id: 3, name: 'Private', value: ['M']},
  ],
  adminFilterSelect:  {
    defaultValue: 'organization',
    options: ['organization', 'creator', 'author']
  },

  primaryFilterValue: Ember.computed.alias('primaryFilter.value'),
  currentUserOrgName: Ember.computed.alias('currentUser.organization.name'),
  doUseSearchQuery: Ember.computed.or('isSearchingProblems', 'isDisplayingSearchResults'),
  selectedPrivacySetting: ['M', 'O', 'E'],
  selectedCategoryFilter: null,

  listResultsMessage: function() {
    let msg;
    if (this.get('criteriaTooExclusive')) {
      msg = 'No results found. Please try expanding your filter criteria.';
      return msg;
    }
    if (this.get('areNoRecommendedProblems')) {
      msg = `There are currently no recommended problems for ${this.get('currentUserOrgName')}.`;
      return msg;
    }
    if (this.get('isDisplayingSearchResults')) {
      msg = `Based off your filter criteria, we found ${this.get('problemsMetadata.total')} problems whose ${this.get('searchCriterion')} contains "${this.get('searchQuery')}"`;
      return;
    }
    msg = `We found ${this.get('problemsMetadata.total')} problems based off of your current filter criteria.`;
    return msg;

  }.property('criteriaTooExclusive', 'areNoRecommendedProblems', 'isDisplayingSearchResults', 'problems.@each.isTrashed'),


  privacySettingFilter: function() {
    return {
     $in: this.get('selectedPrivacySetting')
    };
  }.property('selectedPrivacySetting'),


  init: function() {
    this.configureFilter();
    this.configurePrimaryFilter();
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
    let currentUserOrgName = this.get('currentUserOrgName');

    let filter = {
      primaryFilters: {
        selectedValue: 'mine',
        inputs: {
          mine: {
            label: 'Mine',
            value: 'mine',
            isChecked: true,
          },
          myOrg: {
            label: 'My Org',
            value: 'myOrg',
            isChecked: false,
            secondaryFilters: {
              selectedValues: ['recommended', 'fromOrg'],
              inputs: {
                recommended: {
                  label: 'Recommended',
                  value: 'recommended',
                  isChecked: true,
                  isApplied: true,
                },
                fromOrg: {
                  label: `Created by ${currentUserOrgName} Members`,
                  value: 'fromOrg',
                  isChecked: true,
                  isApplied: true,
                }
              }
            }
          },
          everyone: {
            label: 'Public',
            value: 'everyone',
            isChecked: false,
          }
        }
      }
    };
    let isAdmin = this.get('currentUser.isAdmin');

    if (isAdmin) {
      filter.primaryFilters.inputs.mine.isChecked = false;
      filter.primaryFilters.inputs.all = {
        label: 'All',
        value:'all',
        isChecked: true
      };
    }
    this.set('filter', filter);
  },
  configurePrimaryFilter() {
    let primaryFilters = this.get('filter.primaryFilters');
    if (this.get('currentUser.isAdmin')) {
      primaryFilters.selectedValue = 'all';
      this.set('primaryFilter', primaryFilters.inputs.all);
      return;
    }
    this.set('primaryFilter', primaryFilters.inputs.mine);
  },
  buildMineFilter() {
    let filter = {};
    let userId = this.get('currentUser.id');

    filter.createdBy = userId;

    return filter;
  },
  buildPublicFilter() {
    let filter = {};

    filter.privacySetting = 'E';

    return filter;
  },

  buildMyOrgFilter() {
    let filter = {};

    // 2 options : recommended, fromOrg
    let secondaryValues = this.get('primaryFilter.secondaryFilters.selectedValues');

    let includeRecommended = _.indexOf(secondaryValues, 'recommended') !== -1;
    let includeFromOrg = _.indexOf(secondaryValues, 'fromOrg') !== -1;

    // immediately return 0 results
    if (!includeRecommended && !includeFromOrg) {
      this.set('criteriaTooExclusive', true);
      return;
    }

    filter.$or = [];

    if (includeRecommended) {
      let recommendedProblems = this.get('currentUser.organization.recommendedProblems');
      let ids = recommendedProblems.mapBy('id');

      if (!_.isEmpty(ids)) {
        filter.$or.push({_id: {$in: ids}});
      } else {
        if (!includeFromOrg) {
          // rec only request, but no recs; immediately return nothing;
          this.set('areNoRecommendedProblems', true);
          this.set('problems', []);
          this.set('problemsMetadata', null);
          return;
        }
      }
    }

    if (includeFromOrg) {
      filter.$or.push({organization: this.get('currentUser.organization.id') });
    }

    return filter;
  },

  buildPrivacySettingFilter: function() {
    //privacy setting determined from privacy drop down on main display
    let privacySetting = this.get('privacySettingFilter');
    return {
       $in: privacySetting
    };
  },

  // buildCreatedByFilter: function() {
  //   if (!this.get('filter')) {
  //     return;
  //   }

  //   let filter = this.get('filter');
  //   let { mine } = filter;

  //   //should these be either or?
  //   if (mine) {
  //     let id = this.get('currentUser.id');
  //     return id;
  //   }

  //   // TODO: add creator filter
  // },

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
    let primaryFilterValue = this.get('primaryFilterValue');
    let filterBy;

    if (primaryFilterValue === 'mine') {
      filterBy = this.buildMineFilter();
    }

    if (primaryFilterValue === 'everyone') {
      filterBy = this.buildPublicFilter();
    }

    if (primaryFilterValue === 'myOrg') {
      filterBy = this.buildMyOrgFilter();
    }
    if (!filterBy) {
      return;
    }
    // primary public filter should disable privacy setting dropdown?
    if (primaryFilterValue === 'everyone') {
      filterBy.privacySetting = {$in: ['E']};
    } else {
      let privacySetting = this.get('privacySettingFilter');
      filterBy.privacySetting = privacySetting;
    }


    let selectedCategoryFilter = this.get('selectedCategoryFilter');

    if (selectedCategoryFilter) {
      filterBy.categories = selectedCategory;
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

    if (this.get('criteriaTooExclusive' || this.get('areNoRecommendedProblems')) ) {
      // display message or just 0 results
      this.set('problems', []);
      this.set('problemsMetadata', null);
      return;
    }
    // let filterBy = this.buildFilterRadio();
    console.log('filterBy buildQueryParams', filterBy);
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

    if (this.get('criteriaTooExclusive') || this.get('areNoRecommendedProblems')) {
      return;
    }

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
      this.set('sortCriterion', criterion);
      this.getProblems();
    },
    triggerFetch() {
      for (let prop of ['criteriaTooExclusive', 'areNoRecommendedProblems']) {
        if (this.get(prop)) {
          this.set(prop, null);
        }
      }

      this.getProblems();
    }
  }
});
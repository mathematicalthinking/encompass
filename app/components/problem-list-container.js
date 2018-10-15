Encompass.ProblemListContainerComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {
  elementId: 'problem-list-container',
  searchOptions: ['title', 'text'],
  searchCriterion: 'title',
  sortOptions: ['A-Z', 'Z-A', 'Newest', 'Oldest'],
  sortCriterion: ['A-Z'],

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
  },

  configureFilter: function() {
    let filter = {
      mine: false,
      public: false,
      organization: false,
      categories: []
    };

    let isAdmin = this.get('currentUser.isAdmin');
    if (isAdmin) {
      filter.pows =false;
      filter.private =false;
      filter.creator ='';
    }
    this.set('filter', filter);
  },

  doUseSearchQuery: Ember.computed.or('isSearchingProblems', 'isDisplayingSearchResults'),

  // fetch problems whenever a filter box is checked or unchecked
  observeFilter: function() {
    this.getProblems();
  }.observes('filter.{mine,public,organization,private,pows}','filter.categories.[]', 'doFilterByCategories'),

  // fetch problems whenever different sort option is selected
  observeSort: function() {
    this.getProblems();
  }.observes('sortCriterion'),

  displayProblems: function() {
    let problems = this.get('problems');
    if (problems) {
      return problems.rejectBy('isTrashed');
    }
  }.property('problems.@each.isTrashed'),

  getProblems: function(page) {
    let queryParams = {};

    // always use filter
    let filter = this.get('filter');

    let doFilterByCategories = this.get('doFilterByCategories');
    if (!doFilterByCategories) {
     delete filter.categories;
    }
    queryParams.filter = filter;
    // page is only passed in when fetch is triggered by page arrow or go to page input
    if (page) {
      queryParams.page = page;
    }

    // always use sort
    let sortBy= this.get('sortCriterion');
    queryParams.sortBy = sortBy;

    let searchBy = {};

    // only use search if a new search has been initiated, or currently displaying search
    // results which are being filter
    if (this.get('doUseSearchQuery')) {
      let searchQuery = this.get('searchQuery');

      if (searchQuery) {
        searchBy.query = searchQuery;
        searchBy.criterion = this.get('searchCriterion');
        queryParams.searchBy = searchBy;
      }
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
      console.log('err', err);
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
    }
  },
});
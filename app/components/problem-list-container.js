Encompass.ProblemListContainerComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'problem-list-container',
  searchOptions: ['title', 'text', 'category'],
  searchCriterion: 'title',
  sortOptions: ['A-Z', 'Z-A', 'Newest', 'Oldest'],
  sortCriterion: ['A-Z'],

  init: function() {
    this.configureFilter();
    this._super(...arguments);
  },

  didReceiveAttrs: function() {
    console.log('did receive attrs problem-list-container');
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
  },

  configureFilter: function() {
    let filter = {
      mine: false,
      public: false,
      organization: false
    };

    let isAdmin = this.get('currentUser.isAdmin');
    if (isAdmin) {
      filter.pows =false;
      filter.private =false;
      filter.creator ='';
    }
    this.set('filter', filter);
  },

  observeFilter: function() {
    console.log('filter changed', this.get('filter'));
    this.getProblems();
  }.observes('filter.{mine,public,organization}'),

  observeSort: function() {
    console.log('sort changed');
    this.getProblems();
  }.observes('sortCriterion'),

  displayProblems: function() {
    let problems = this.get('problems');
    if (problems) {
      return problems.rejectBy('isTrashed');
    }
  }.property('problems.@each.isTrashed'),

  getProblems: function() {
    let filter = this.get('filter');
    let searchText = this.get('searchText');
    let searchCriterion;
    if (searchText) {
      searchCriterion = this.get('searchCriterion');
      filter[searchCriterion] = searchText;
    }
    let sort = this.get('sortCriterion');

    this.store.query('problem', {
      filter,
      sort
    }).then((results) => {
      console.log('results', results);
      this.set('problems', results);
    }).catch(console.log);
  },

  // observeNewProblem: function() {
  //   if (this.get('changingPage')) {
  //     return;
  //   }
  //   if (this.get('isSearching')) {
  //     return;
  //   }
  //   // all problems in store
  //   let problems = this.allProblems;
  //   // all valid problems
  //   let validProblems = problems.filter((p) => {
  //     return p.get('isValid');
  //   });

  //   // current problems being displayed
  //   // converting to array because cant use addOBject on adapter populated array
  //   let listProblems = this.get('problems').toArray();

  //   let sortedProblems = validProblems.sortBy('createDate').reverse();
  //   let mostRecent = sortedProblems.objectAt(0);
  //   listProblems.addObject(mostRecent);
  //   this.set('listProblems', listProblems);
  // }.observes('problems.[]'),

  actions: {
    searchPublic: function() {
      this.set('isSearching', true);
      let searchText = this.get('publicSearchText');
      if (!searchText) {
        return;
      }
      this.set('searchQuery', searchText);
      let filter = this.get('publicFilter');
      if (filter) {
        filter.title = searchText;
      } else {
        filter = {
          title: searchText
        };
      }

      this.store.query('problem', {
       filterBy: filter
      }).then((results) => {
        this.set('publicSearchResults', results);
        this.set('publicSearchMetadata', results.get('meta'));
      });
    },
    clearPublicResults: function() {
      this.set('isSearching', false);
      this.set('publicSearchText', null);
      this.set('searchQuery', null);
      this.set('publicSearchResults', null);

      let publicFilter = this.get('publicFilter');
      if (publicFilter) {
        delete publicFilter.title;
      }
      this.store.query('problem', {}).then((results) => {
        this.set('publicList', results);
        this.set('metadata', results.get('meta'));
      }).catch((err) => {
        this.handleErrors(err, 'dataLoadErrors');
      });
    },
    updatePageResults(results) {
      this.set('problems', results);
    },

    startPageChange() {
      this.set('changingPage', true);
    },
    endPageChange() {
      this.set('changingPage', false);
    },
    searchProblems() {
      this.getProblems();
    }
  },
});
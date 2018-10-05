Encompass.ProblemListComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'problem-list',
  classNames: ['problem-list', 'left-list'],
  publicFilter: {
    privacySetting: 'E'
  },
  privateFilter: {},
  orgFilter: {
    privacySetting: 'O',
  },

  dataLoadErrors: [],

  observeNewProblem: function() {
    if (this.get('changingPage')) {
      return;
    }
    // all problems in store
    let problems = this.problems;
    // all valid problems
    let validProblems = problems.filter((p) => {
      return p.get('isValid');
    });

    // current problems being displayed
    // converting to array because cant use addOBject on adapter populated array
    let yourProblemsList = this.get('yourProblemsList').toArray();

    let sortedProblems = validProblems.sortBy('createDate').reverse();
    let mostRecent = sortedProblems.objectAt(0);
    console.log('mostRecent', mostRecent);
    yourProblemsList.addObject(mostRecent);
    this.set('yourProblemsList', yourProblemsList);
  }.observes('problems.[]'),

  didReceiveAttrs: function() {
    // set initial results from route
    if (!this.get('yourProblemsList')) {
      this.set('yourProblemsList', this.get('ownProblems'));
    }

    if (!this.get('orgProblemsList')) {
      this.set('orgProblemsList', this.get('organizationProblems'));

    }

    if (!this.get('publicProblemsList')) {
      this.set('publicProblemsList', this.get('openProblems'));
    }

    let currentUser = this.get('currentUser');
    let privateFilter = this.get('privateFilter');
    privateFilter.createdBy = currentUser.id;

    let orgFilter = this.get('orgFilter');
    orgFilter.createdBy = {$ne: currentUser.id};

    let publicFilter = this.get('publicFilter');
    publicFilter.createdBy = {$ne: currentUser.id};

    let ownProblemsMetadata = this.ownProblems.get('meta');
    this.set('ownProblemsMetadata', ownProblemsMetadata);

    let orgProblemsMetadata = this.organizationProblems.get('meta');
    this.set('orgProblemsMetadata', orgProblemsMetadata);

    let publicProblemsMetadata = this.openProblems.get('meta');
    this.set('publicProblemsMetadata', publicProblemsMetadata);
  },

  init: function() {
    this._super(...arguments);
  },

  // This displays only the problems beloging to the current user
  yourProblems: function () {
    let problems = this.get('yourProblemsList');
    let valid = problems.filter(p => !!p.id && !p.get('isTrashed'));
    return valid;

  }.property('yourProblemsList.@each.isTrashed'),

  // This displays only the problems beloging to the current user's organizaton
  orgProblems: function () {
    let problems = this.get('orgProblemsList');
    let valid = problems.filter(p => !!p.id && !p.get('isTrashed'));
    return valid;

  }.property('orgProblemsList.@each.isTrashed'),

  // // This sorts all the problems that are visible to everyone
  publicProblems: function () {
    let problems = this.get('publicProblemsList');
    let valid = problems.filter(p => !!p.id && !p.get('isTrashed'));
    return valid;
  }.property('publicProblemsList.@each.isTrashed'),

  actions: {
    searchPublic: function() {
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
      this.set('yourProblemsList', results);
    },
    updatePublicPageResults(results) {
      this.set('publicProblemsList', results);
    },
    updateOrgPageResults(results) {
      this.set('orgProblemsList', results);
    },
    startPageChange() {
      this.set('changingPage', true);
    },
    endPageChange() {
      this.set('changingPage', false);
    }
  },
});


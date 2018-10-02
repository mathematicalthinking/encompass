Encompass.ProblemListComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'problem-list',
  classNames: ['problem-list', 'left-list'],
  yourProblemList: null,
  publicFilter: {
    privacySetting: 'E'
  },
  dataLoadErrors: [],
  publicCurrentPage: null,
  publicGoToPage: null,


  didReceiveAttrs: function() {
    let filter = this.get('publicFilter');
    this.store.query('problem', {
      filterBy: filter,
    }).then((res) => {
      this.set('publicQueryResults', res);
      this.set('publicProblemsMetadata', res.get('meta'));
    }).catch((err) => {
      this.handleErrors(err, 'dataLoadErrors');
    });
  },

  init: function() {
    this._super(...arguments);
  },


  // This displays only the problems beloging to the current user
  yourProblems: function () {
    var problems = this.problems.filterBy('isTrashed', false);
    var currentUser = this.get('currentUser');
    var yourProblems = problems.filterBy('createdBy.content', currentUser);
    this.set('yourProblemList', yourProblems);
    return yourProblems.sortBy('createDate').reverse();
  }.property('problems.@each.isTrashed', 'currentUser.isStudent'),

  // This displays only the problems beloging to the current user's organizaton
  orgProblems: function () {
    var problems = this.problems.filterBy('isTrashed', false);
    var currentUser = this.get('currentUser');
    var orgProblems = problems.filterBy('privacySetting', 'O');
    var yourOrg = orgProblems.filter((el) => {
      let content = el.get('createdBy.content');
      return content.id !== currentUser.id;
    });
    return yourOrg.sortBy('createDate').reverse();
  }.property('problems.@each.isTrashed', 'currentUser.isStudent'),

  // This sorts all the problems that are visible to everyone
  publicProblems: function () {
    var queryResults = this.get('publicQueryResults');
    var problems;
    if (!queryResults) {
      problems = this.problems;
    } else {
      problems = queryResults;
    }
    problems = problems.filterBy('isTrashed', false);
    var currentUser = this.get('currentUser');
    var publicProblems = problems.filterBy('privacySetting', 'E');
    var yourPublic = publicProblems.filter((el) => {
      let content = el.get('createdBy.content');
      return content.id !== currentUser.id;
    });
    return yourPublic.sortBy('createDate').reverse();
  }.property('problems.@each.isTrashed','publicQueryResults.@each.isTrashed', 'currentUser.isStudent'),

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
  },



});


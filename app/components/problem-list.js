Encompass.ProblemListComponent = Ember.Component.extend( {
  elementId: 'problem-list',
  classNames: ['problem-list', 'left-list'],

  dataLoadErrors: [],


  didReceiveAttrs: function() {
    // ['problems', 'metadata', 'currentUser']
    // set initial results from route
  },

  init: function() {
    this._super(...arguments);
  },
  actions: {
    toProblemInfo(problem) {
      this.sendAction("toProblemInfo", problem);
    }
  }


});


Encompass.ProblemListComponent = Ember.Component.extend( {
  elementId: 'problem-list',
  classNames: ['problem-list', 'left-list'],
  containerData: Ember.computed.alias("parentView"),
  containerActions: Ember.computed.alias("parentView.actions"),

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


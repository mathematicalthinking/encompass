Encompass.ProblemsRoute = Encompass.AuthenticatedRoute.extend({
  beforeModel: function() {
    const user = this.modelFor('application');
    const isStudent = user.get('isStudent');

    if (isStudent) {
      this.transitionTo('/');
    }
  },
  model: function () {
    const store = this.get('store');
    const user = this.modelFor('application');
    let problemCriteria = {};

    if (!user.get('isAdmin')) {
      problemCriteria = {
        filterBy: {
          createdBy: user.id
        }
      };
    }
    return Ember.RSVP.hash({
      organizations: store.findAll('organization'),
      sections: store.findAll('section'),
      problems: store.query('problem', problemCriteria),
    });
  },

  renderTemplate: function () {
    this.render('problems/problems');
  },

});


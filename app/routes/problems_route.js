Encompass.ProblemsRoute = Encompass.AuthenticatedRoute.extend({
  beforeModel: function() {
    const user = this.modelFor('application');
    const isStudent = user.get('isStudent');

    if (isStudent) {
      this.transitionTo('/');
    }
  },
  model: function () {
    let userId = this.modelFor('application').id;
    return Ember.RSVP.hash({
      openProblems: this.get('store').query('problem', {
        filterBy: {
          privacySetting: 'E',
          createdBy: { $ne: userId }
        }
      }),
      ownProblems: this.get('store').query('problem', {
        filterBy: {
         createdBy: userId
        }
      }),
      organizationProblems: this.get('store').query('problem', {
        filterBy: {
          privacySetting: 'O',
          createdBy: { $ne: userId }
        }
      }),
      organizations: this.get('store').findAll('organization'),
      sections: this.get('store').findAll('section'),
      problems: this.get('store').findAll('problem')
    });
  },

  renderTemplate: function () {
    this.render('problems/problems');
  },

});


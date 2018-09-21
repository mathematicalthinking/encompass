Encompass.SectionsNewRoute = Encompass.AuthenticatedRoute.extend({
    model: function (params) {
      return Ember.RSVP.hash({
        users: this.get('store').findAll('user'),
        organizations: this.get('store').findAll('organization'),
        user: this.modelFor('application'),
        sections: this.get('store').findAll('section')
      });
    },
    renderTemplate: function () {
      this.render('sections/new');
    },
    actions: {
      toSectionInfo: function(section) {
        this.transitionTo('section', section);
      },
      toSectionsHome: function() {
        this.transitionTo('sections.home');
      }
    }
  });
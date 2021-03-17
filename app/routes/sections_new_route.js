Encompass.SectionsNewRoute = Encompass.AuthenticatedRoute.extend({
  beforeModel: function() {
    this._super.apply(this, arguments);

    const user = this.modelFor('application');
    const isStudent = user.get('isStudent');

    if (isStudent) {
      this.transitionTo('sections.home');
    }
  },

  model: function (params) {
      return Ember.RSVP.hash({
        users: this.get('store').findAll('user'),
        organizations: this.get('store').findAll('organization'),
        user: this.modelFor('application'),
        sections: this.get('store').findAll('section'),
        workspaces: this.get('store').findall('workspace'),
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

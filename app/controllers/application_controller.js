/**
  * # Application Controller
  * @description The controller for the application. Right now, we use this primarily for keeping track of the current user
  * @authors Damola Mabogunje <damola@mathforum.org>, Amir Tahvildaran <amir@mathforum.org>
  * @since 1.0.0
*/
Encompass.ApplicationController = Ember.Controller.extend({
  showCategoryList: true,

  init: function() {
    this._super(...arguments);
    this.get('store').query('category', {}).then((queryCats) => {
      let categories = queryCats.get('meta');
      this.set('categoryTree', categories.categories);
      this.set('showCategoryList', true);
    });
  },

  currentUser: function() {
    return this.get('model');
  }.property('model'),
  isHidden: false,

  resizeDisplay: function() {
    Ember.run.next(this, Ember.verticalSizing);
  }.observes('isSmallHeader'),

  actions: {
    toHome: function() {
      this.transitionToRoute('/');
    },
    closeModal() {
      this.set('showCategoryList', false);
    },
  }
});

/**
  * # Application Controller
  * @description The controller for the application. Right now, we use this primarily for keeping track of the current user
  * @authors Damola Mabogunje <damola@mathforum.org>, Amir Tahvildaran <amir@mathforum.org>
  * @since 1.0.0
*/
Encompass.ApplicationController = Ember.Controller.extend({
  showCategoryList: false,
  isHidden: false,
  selectedCategories: [],
  isTouchScreen: false,

  currentUser: function() {
    return this.get('model');
  }.property('model'),


  // resizeDisplay: function() {
  //   Ember.run.next(this, Ember.verticalSizing);
  // }.observes('isSmallHeader'),

  actions: {
    toHome: function() {
      this.transitionToRoute('/');
    },
    closeModal: function() {
      this.set('showCategoryList', false);
    },
    searchCategory: function(category) {
      this.get('selectedCategories').pushObject(category);
    },
    handleFirstTouch() {
      this.set('isTouchScreen', true);
    }
  }
});

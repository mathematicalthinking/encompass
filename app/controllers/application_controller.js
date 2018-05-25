/**
  * # Application Controller
  * @description The controller for the application. Right now, we use this primarily for keeping track of the current user
  * @authors Damola Mabogunje <damola@mathforum.org>, Amir Tahvildaran <amir@mathforum.org>
  * @since 1.0.0
*/
Encompass.ApplicationController = Ember.Controller.extend({
  currentUser: function() {
    return this.get('model');
  }.property('model'),
  isHidden: false,

  resizeDisplay: function() {
    Ember.run.next(this, Ember.verticalSizing);
  }.observes('isSmallHeader')
});

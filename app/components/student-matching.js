Encompass.StudentMatchingComponent = Ember.Component.extend({

  actions: {
    formatAnswers: function() {
      this.get('uploadAnswers')();
    }
  }

});
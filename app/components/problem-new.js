Encompass.ProblemNewComponent = Ember.Component.extend({
  actions: {
    radioSelect: function (value) {
      this.set('isPublic', value);
    },

    createProblem: function () {
      var createdBy = this.get('currentUser');
      var title = this.get('title');
      var text = this.get('text');
      var categories = [];
      var additionalInfo = this.get('additionalInfo');
      var isPublic = this.get('isPublic');
      var createProblemData = this.store.createRecord('problem', {
        createdBy: createdBy,
        createDate: new Date(),
        title: title,
        text: text,
        // categories: categories,
        additionalInfo: additionalInfo,
        isPublic: isPublic,
      });
      createProblemData.save();
    }
  }
});


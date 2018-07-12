Encompass.ImportDetailsComponent = Ember.Component.extend({
  actions: {
    editProblem: function(detailName) {
      this.get('editImportDetail')(detailName);
    }
  }
});
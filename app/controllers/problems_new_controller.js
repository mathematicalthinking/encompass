/**
 * # Create a Problem Controller
 * @description This controller for creating a new problem
 * @author Philip Wisner
 * @since 1.0.0
 */

Encompass.ProblemsNewController = Ember.Controller.extend(Encompass.CurrentUserMixin, {
  actions: {
    // This action just sets whatever the value of the selected radio button is to the value for is Public
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

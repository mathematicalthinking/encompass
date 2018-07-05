Encompass.ImportWorkComponent = Ember.Component.extend({
  selectedProblem: null,
  selectedSection: null,
  selectedFiles: null,
  isCreatingNewProblem: null,
  problems: null,
  sections: null,
  uploadedFiles: null,
  isMatchingStudents: null,
  answers: null,

  readyToMatchStudents: Ember.computed('selectedProblem', 'selectedSection', 'uploadedFiles', function() {
    var problem = this.get('selectedProblem');
    var section = this.get('selectedSection');
    var files = this.get('uploadedFiles');

    var isReady = !Ember.isEmpty(problem) && !Ember.isEmpty(section) && !Ember.isEmpty(files);
    return isReady;
  }),

  didInsertElement: function() {
    console.log('inserted element');
    this.set('problems', this.model.problems);
    this.set('sections', this.model.sections);
    console.log('currentUser', this.get('currentUser'));
  },

  updateAnswer: function(e) {
    console.log('ee', e);
  },

  actions: {
    toggleNewProblem: function() {
      if (this.get('isCreatingNewProblem') !== true) {
        this.set('isCreatingNewProblem', true);
      } else {
        this.set('isCreatingNewProblem', false);
      }
    },
    loadStudentMatching: function() {
      this.set('isMatchingStudents', true);
      var images = this.get('uploadedFiles');
      var answers = [];
      images.forEach((image) => {
        let ans = {};
        ans.explanation = image;
        ans.problemId = this.get('selectedProblem').id;
        ans.sectionId = this.get('selectedSection').id;
        ans.isSubmitted = true;
        answers.push(ans);
      });

      this.set('answers', answers);
    },

    uploadAnswers: function() {
      console.log('uploading Answers');
      var answers = this.get('answers');

    }

    // updateAnswer: function(user) {
    //   console.log('user in updateAnswer: ', user);
    // }

  }
});
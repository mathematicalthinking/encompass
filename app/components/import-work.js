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
  uploadedAnswers: null,
  uploadedSubmissions: null,
  createdWorkspace: null,
  isReviewingSubmissions: null,
  doCreateWorkspace: true,
  isPrivate: true,
  uploadError: null,

  readyToMatchStudents: Ember.computed('selectedProblem', 'selectedSection', 'uploadedFiles', function() {
    var problem = this.get('selectedProblem');
    var section = this.get('selectedSection');
    var files = this.get('uploadedFiles');

    var isReady = !Ember.isEmpty(problem) && !Ember.isEmpty(section) && !Ember.isEmpty(files);
    return isReady;
  }),

  onStepOne: Ember.computed('isMatchingStudents', 'isReviewingSubmissions', 'uploadedSubmissions', function() {
    var isMatchingStudents = this.get('isMatchingStudents');
    var isReviewingSubmissions = this.get('isReviewingSubmissions');
    var uploadedSubmissions = this.get('uploadedSubmissions');

    return !isMatchingStudents && !isReviewingSubmissions && !uploadedSubmissions;
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
        ans.problem = this.get('selectedProblem');
        ans.section = this.get('selectedSection');
        ans.isSubmitted = true;
        answers.push(ans);
      });

      this.set('answers', answers);
    },

    reviewSubmissions: function() {
      console.log('reviewing submissions');
      this.set('isMatchingStudents', false);
      this.set('isReviewingSubmissions', true);
    },

    uploadAnswers: function() {
      console.log('uploading Answers');
      var answers = this.get('answers');
      var that = this;
      let subs;
      return Promise.all(answers.map((answer) => {
        answer.explanation = answer.explanation._id;
        let ans = that.store.createRecord('answer', answer);
        ans.set('section', that.get('selectedSection'));
        ans.set('problem', that.get('selectedProblem'));
        return ans.save();
      }))
        .then((res) => {
        that.set('uploadedAnswers',res);
        subs = res.map((ans) => {
          //const teachers = {};
          const clazz = {};
          const publication = {
            publicationId: null,
            puzzle: {}
          };
          const creator = {};
          const teacher = {};


          const student = ans.get('student');
          const section = ans.get('section');
          const problem = ans.get('problem');

          publication.puzzle.title = problem.get('title');
          publication.puzzle.problemId = problem.get('problemId');

          creator.studentId = student.get('userId');
          creator.username = student.get('username');

          clazz.sectionId = section.get('sectionId');
          clazz.name = section.get('name');

          const teachers = section.get('teachers');
          const primaryTeacher = teachers.get('firstObject');


          teacher.id = primaryTeacher.get('userId');
          let sub = {
            longAnswer: ans.get('explanation'),
            answer: ans.get('answerId'),
            clazz: clazz,
            creator: creator,
            teacher: teacher,
            publication: publication
          };
          return sub;
        });
        let postData = {
          "subs": JSON.stringify(subs),
          "doCreateWorkspace": JSON.stringify(this.get('doCreateWorkspace')),
          "isPrivate": JSON.stringify(this.get('isPrivate'))
        };
        console.log('subs', subs);
         Ember.$.post({
          url: 'api/import',
          data: postData
        })
        .then((res) => {
          that.set('isReviewingSubmissions', false);
          // if workspace created
          if (res.workspaceId) {
            that.set('createdWorkspace', res);
          // should we redirect to workspaces list or workspace page?
          console.log('sending Action');
          that.sendAction('toWorkspaces');
          } else {
            that.set('uploadedSubmissions', res.submissionIds);
          }

        })
        .catch((err) => {
          that.set('uploadError', err);
          console.log(err);
        });
      });
    }


  }
});
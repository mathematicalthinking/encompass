Encompass.ImportWorkComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
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
  doNotCreateWorkspace: false,
  doCreateWorkspace: Ember.computed.not('doNotCreateWorkspace'),

  uploadError: null,
  isSelectingImportDetails: true,
  mode: 'private',
  requestedName: null,
  selectedFolderSet: null,
  isPrivate: Ember.computed.equal('mode', 'private'),

  readyToMatchStudents: Ember.computed('selectedProblem', 'selectedSection', 'uploadedFiles', function() {
    const problem = this.get('selectedProblem');
    const section = this.get('selectedSection');
    const files = this.get('uploadedFiles');

    const isReady = !Ember.isEmpty(problem) && !Ember.isEmpty(section) && !Ember.isEmpty(files);
    return isReady;
  }),

  onStepOne: Ember.computed('isMatchingStudents', 'isReviewingSubmissions', 'uploadedSubmissions', function() {
    const isMatchingStudents = this.get('isMatchingStudents');
    const isReviewingSubmissions = this.get('isReviewingSubmissions');
    const uploadedSubmissions = this.get('uploadedSubmissions');

    return !isMatchingStudents && !isReviewingSubmissions && !uploadedSubmissions;
  }),

  prevStep: Ember.computed('isMatchingStudents', 'isReviewingSubmissions', function() {
    let isMatchingStudents = this.get('isMatchingStudents');
    let isReviewingSubmissions = this.get('isReviewingSubmissions');

    if (isMatchingStudents) {
      return 'Import Detail Selection';
    }
    if (isReviewingSubmissions) {
      return 'Student Matching';
    }
    return null;
  }),

  init: function() {
    this._super(...arguments);
    let problems = this.model.problems;
    var currentUser = this.get('currentUser');
    let myProblems = problems.filterBy('createdBy.content', currentUser);

    this.set('problems', myProblems);
    this.set('sections', this.model.sections);
  },

  actions: {
    toggleNewProblem: function() {
      if (this.get('isCreatingNewProblem') !== true) {
        this.set('isCreatingNewProblem', true);
      } else {
        this.set('isCreatingNewProblem', false);
      }
    },

    editImportDetail: function(detailName) {
      if (!detailName || typeof detailName !== 'string') {
        return;
      }
      this.set(detailName, null);
      if (detailName === 'uploadedFiles') {
        this.set('selectedFiles', null);
      }
    },

    backToPrevStep: function(prevStep) {
      if (!prevStep || typeof prevStep !== 'string') {
        return;
      }

      if (prevStep === 'Import Detail Selection') {
        this.set('isMatchingStudents', false);
        this.set('isSelectingImportDetails', true);
        return;
      }
      if (prevStep === 'Student Matching') {
        this.set('isReviewingSubmissions', false);
        this.set('isMatchingStudents', true);
        return;
      }
    },

    loadStudentMatching: function() {
      this.set('isSelectingImportDetails', false);
      this.set('isMatchingStudents', true);
      let images = this.get('uploadedFiles');
      let answers = [];

      images.forEach((image) => {
        let ans = {};
        ans.explanation = `<img src="${image.data}">`;
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
      let answers = this.get('answers');
      const that = this;
      let subs;
      return Promise.all(answers.map((answer) => {
        answer.createdBy = answer.student;
        answer.answer = 'See image.';

        let ans = that.store.createRecord('answer', answer);
        ans.set('section', that.get('selectedSection'));
        ans.set('problem', that.get('selectedProblem'));
        return ans.save();
      }))
        .then((res) => {
        // if doCreateWorkspace, convert to submissions and create workspace
        // else just display details about # of answers uploaded
          const uploadedAnswers = res;

          if (that.doCreateWorkspace) {
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
            console.log('ans.id', ans.id);
            let sub = {
              // longAnswer: ans.get('explanation'),
              answer: ans.id,
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
            "isPrivate": JSON.stringify(this.get('isPrivate')),
            "requestedName": JSON.stringify(this.get('requestedName')),
            "folderSet": JSON.stringify(this.get('selectedFolderSet.name'))
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
            }

          })
          .catch((err) => {
            that.set('uploadError', err);
            console.log(err);
          });
        } else { // don't create workspace
        that.set('isReviewingSubmissions', false);
        that.set('uploadedAnswers', uploadedAnswers);
        }


      });
    }


  }
});
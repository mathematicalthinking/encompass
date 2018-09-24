Encompass.ProblemInfoComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {
  elementId: 'problem-info',
  isEditing: false,
  problemName: null,
  problemText: null,
  problemPublic: true,
  privacySetting: null,
  savedProblem: null,
  isWide: false,
  checked: true,
  filesToBeUploaded: null,
  isProblemUsed: false,
  showAssignment: false,
  problemList: [],
  sectionList: null,
  updateProblemErrors: [],
  imageUploadErrors: [],
  isMissingRequiredFields: null,

  init: function () {
    this._super(...arguments);
    this.get('store').findAll('section').then(sections => {
      this.set('sectionList', sections);
    });
  },

  didReceiveAttrs: function () {
    this.set('isWide', false);
    this.set('showAssignment', false);
    this.set('isEditing', false);
    let problem = this.get('problem');
    let problemId = problem.get('id');

    this.get('store').queryRecord('answer', {
      problem: problemId
    }).then((answer) => {
      if (answer !== null) {
        this.set('isProblemUsed', true);
      } else {
        this.set('isProblemUsed', false);
      }
    });

    this.get('store').findAll('section').then(sections => {
      this.set('sectionList', sections);
    });
  },

  // We can access the currentUser using CurrentUserMixin, this is accessible because we extend it
  // Check if the current problem is yours, so that you can edit it
  canEdit: Ember.computed('problem.id', function() {
    let problem = this.get('problem');
    let creator = problem.get('createdBy.content.id');
    let currentUser = this.get('currentUser');

    let canEdit = creator === currentUser.id ? true : false;
    return canEdit;
  }),

  resetErrors: function() {
    let errors = ['updateProblemErrors', 'imageUploadErrors', 'isMissingRequiredFields'];
    for (let error of errors) {
      if (this.get(error)) {
        this.set(error, null);
      }
    }

  },

  actions: {
    deleteProblem: function () {
      let problem = this.get('problem');
        problem.set('isTrashed', true);
        problem.save()
          .then(() => {
              this.sendAction('toProblemList');
          })
          .catch((err) => {
            this.handleErrors(err, 'updateProblemErrors', problem);
          });
    },

    editProblem: function () {
      let problem = this.get('problem');
      this.set('isEditing', true);
      this.set('problemName', problem.get('title'));
      this.set('problemText', problem.get('text'));
      this.set('privacySetting', problem.get('privacySetting'));
    },

    cancelEdit: function () {
      this.set('isEditing', false);
    },

    radioSelect: function (value) {
      this.set('privacySetting', value);
    },

    updateProblem: function () {
      let title = this.get('problemName');
      let text = this.get('problemText');
      let privacy = this.get('privacySetting');
      let problem = this.get('problem');
      let currentUser = this.get('currentUser');



      if (!title || !text || !privacy) {
        this.set('isMissingRequiredFields', true);
        return;
      } else {
        if (this.get('isMissingRequiredFields')) {
          this.set('isMissingRequiredFields', null);
        }
      }

      problem.set('title', title);
      problem.set('text', text);
      if (privacy !== null) {
        problem.set('privacySetting', privacy);
      }
      problem.set('modifiedBy', currentUser);

      if(this.filesToBeUploaded) {
        var uploadData = this.get('filesToBeUploaded');
        var formData = new FormData();
        for (let f of uploadData) {
          formData.append('photo', f);
        }
        let firstItem = uploadData[0];
        let isPDF = firstItem.type === 'application/pdf';

        if (isPDF) {
          Ember.$.post({
            url: '/pdf',
            processData: false,
            contentType: false,
            data: formData
          }).then((res) => {
            this.set('uploadResults', res.images);
            this.store.findRecord('image', res.images[0]._id).then((image) => {
              problem.set('image', image);
              problem.save().then((res) => {
                // handle success
                this.set('isEditing', false);
                this.resetErrors();
              })
              .catch((err) => {
                this.handleErrors(err, 'updateProblemErrors', problem);
              });
            });
          })
          .catch((err) => {
            this.handleErrors(err, 'imageUploadErrors');
          });
        } else {
          Ember.$.post({
            url: '/image',
            processData: false,
            contentType: false,
            data: formData
          }).then((res) => {
            this.set('uploadResults', res.images);
            this.store.findRecord('image', res.images[0]._id).then((image) => {
              problem.set('image', image);
              problem.save().then((res) => {
                // handle success
                this.set('isEditing', false);

                this.resetErrors();
              })
              .catch((err) => {
                this.handleErrors(err, 'updateProblemErrors', problem);
              });
            });
          })
          .catch((err) =>{
            this.handleErrors(err, 'imageUploadErrors');
          });
        }
      } else {
        problem.save().then((res) => {
          // handle success
          this.resetErrors();
          this.set('isEditing', false);
        })
        .catch((err) => {
          this.handleErrors(err, 'updateProblemErrors', problem);
          return;
        });
      }




    },

    addToMyProblems: function() {
      let problem = this.get('problem');
      let originalTitle = problem.get('title');
      let title = 'Copy of ' + originalTitle;
      let text = problem.get('text');
      let additionalInfo = problem.get('additionalInfo');
      let isPublic = problem.get('isPublic');
      let image = problem.get('image');
      let imageUrl = problem.get('imageUrl');
      let createdBy = this.get('currentUser');

      let newProblem = this.store.createRecord('problem', {
        title: title,
        text: text,
        additionalInfo: additionalInfo,
        imageUrl: imageUrl,
        isPublic: isPublic,
        origin: problem,
        createdBy: createdBy,
        image: image,
        privacySetting: "M",
        createDate: new Date()
      });

      newProblem.save()
        .then((problem) => {
          this.set('savedProblem', problem);
        });
    },

    duplicateProblem: function () {
      let problem = this.get('problem');
      let originalTitle = problem.get('title');
      let title = 'Copy of ' + originalTitle;
      let text = problem.get('text');
      let additionalInfo = problem.get('additionalInfo');
      let isPublic = problem.get('isPublic');
      let imageUrl = problem.get('imageUrl');
      let image = problem.get('image');
      let createdBy = this.get('currentUser');

      let newProblem = this.store.createRecord('problem', {
        title: title,
        text: text,
        additionalInfo: additionalInfo,
        imageUrl: imageUrl,
        isPublic: isPublic,
        image: image,
        origin: problem,
        privacySetting: "M",
        createdBy: createdBy,
        createDate: new Date()
      });

      newProblem.save()
        .then((problem) => {
          this.set('savedProblem', problem);
      });
    },

    toggleImageSize: function () {
      this.toggleProperty('isWide');
    },


    deleteImage: function () {
      let problem = this.get('problem');
      problem.set('image', null);
      problem.save().then((res) => {
        // handle success
      })
      .catch((err) => {
        this.handleErrors(err, 'updateProblemErrors', problem);
      });
    },

    toAssignmentInfo: function (assignment) {
      this.sendAction('toAssignmentInfo', assignment);
    },

    showAssignment: function () {
      this.set('showAssignment', true);
      this.get('problemList').pushObject(this.problem);
      Ember.run.later(() => {
        $('html, body').animate({scrollTop: $(document).height()});
      }, 100);
    }
  }
});
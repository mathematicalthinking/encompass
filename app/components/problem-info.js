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
  findRecordErrors: [],
  createRecordErrors: [],
  isMissingRequiredFields: null,

  init: function () {
    this._super(...arguments);
    this.get('store').findAll('section').then(sections => {
      this.set('sectionList', sections);
    }).catch((err) => {
      this.handleErrors(err, 'findRecordErrors');
    });
  },

  didReceiveAttrs: function () {
    this.set('isWide', false);
    this.set('showAssignment', false);
    this.set('isEditing', false);

    let problem = this.get('problem');
    let problemId = problem.get('id');
    // this.get('store').queryRecord('answer', {
    //   problem: problemId
    // }).then((answer) => {
    //   if (answer !== null) {
    //     this.set('isProblemUsed', true);
    //   } else {
    //     this.set('isProblemUsed', false);
    //   }
    // });

    this.get('store').findAll('section').then(sections => {
      this.set('sectionList', sections);
    }).catch((err) => {
      this.handleErrors(err, 'findRecordErrors');
    });
  },

  insertQuillContent: function() {
    const isEditing = this.get('isEditing');
    if (!isEditing) {
      return;
    }
    const options = {
      debug: 'false',
      modules: {
        toolbar: [
        ['bold', 'italic', 'underline'],
        ['image'],
        ]
      },
      theme: 'snow'
    };
    const that = this;
    this.$('#editor').ready(function() {
      const quill = new window.Quill('#editor', options);
      let problem = that.get('problem');
      let text = problem.get('text');

      that.$('.ql-editor').html(text);
    });
  }.observes('isEditing'),

  // We can access the currentUser using CurrentUserMixin, this is accessible because we extend it
  // Check if the current problem is yours, so that you can edit it
  canEdit: Ember.computed('problem.id', function() {
    let problem = this.get('problem');
    let creator = problem.get('createdBy.content.id');
    let currentUser = this.get('currentUser');
    let accountType = currentUser.get('accountType');
    let canEdit;

    if (accountType === "A") {
      canEdit = true;
    } else if (accountType === "P") {
      if (problem.get('privacySetting') === "O" || creator === currentUser.id) {
        canEdit = true;
      }
    } else if (accountType === "T") {
      if (creator === currentUser.id) {
        canEdit = true;
      }
    } else {
      canEdit = false;
    }
    return canEdit;
  }),

  canDelete: Ember.computed('problem.id', function () {
    let problem = this.get('problem');
    let currentUser = this.get('currentUser');
    let currentUserType = currentUser.get('accountType');
    let creator = problem.get('createdBy.content.id');
    let canDelete;

    if (currentUserType === "A") {
      canDelete = true;
    } else if (currentUserType === "P") {
      if (problem.get('privacySetting') === "O" || creator === currentUser.id) {
        canDelete = true;
      }
    } else if (currentUserType === "T") {
      if (problem.get('privacySetting') === "M") {
        canDelete = true;
      }
    } else {
      canDelete = false;
    }
    return canDelete;
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
      let problemId = problem.get('id');

      if (!problem.get('isUsed')) {
        this.get('store').queryRecord('assignment', {
          problem: problemId
        }).then(assignment => {
          if (assignment !== null) {
            this.set('showEditWarning', true);
          } else {
            this.set('isEditing', true);
            this.set('problemName', problem.get('title'));
            this.set('problemText', problem.get('text'));
            this.set('additionalInfo', problem.get('additionalInfo'));
            this.set('privacySetting', problem.get('privacySetting'));
          }
        });
      }
    },

    continueEdit: function () {
      this.set('showEditWarning', false);
      this.set('isEditing', true);
      let problem = this.get('problem');
      this.set('problemName', problem.get('title'));
      this.set('problemText', problem.get('text'));
      this.set('privacySetting', problem.get('privacySetting'));
    },

    cancelEdit: function () {
      this.set('isEditing', false);
      this.resetErrors();
    },

    radioSelect: function (value) {
      this.set('privacySetting', value);
    },

    checkPrivacy: function() {
      let currentPrivacy = this.problem.get('privacySetting');
      let privacy = this.get('privacySetting');

      if (currentPrivacy !== "E" && privacy === "E") {
        this.set('showConfirmModal', true);
      } else {
        this.send('updateProblem');
      }
    },


    updateProblem: function () {
      let title = this.get('problemName');
      const quillContent = this.$('.ql-editor').html();
      let text = quillContent.replace(/["]/g, "'");
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

      if (privacy !== null) {
        problem.set('privacySetting', privacy);
      }

      problem.set('title', title);
      problem.set('text', text);


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
                this.set('showConfirmModal', false);
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
                this.set('showConfirmModal', false);
              });
            });
          })
          .catch((err) =>{
            this.handleErrors(err, 'imageUploadErrors');
          });
        }
      } else {
        if (problem.get('hasDirtyAttributes')) {
          problem.set('modifiedBy', currentUser);
          problem.save().then((res) => {
            this.resetErrors();
            this.set('showConfirmModal', false);
            this.set('isEditing', false);
          })
          .catch((err) => {
            this.handleErrors(err, 'updateProblemErrors', problem);
            this.set('showConfirmModal', false);
            return;
          });
        } else {
          this.set('isEditing', false);
        }
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
        }).catch((err) => {
          this.handleErrors(err, 'createRecordErrors', newProblem);
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
      }).catch((err) => {
        this.handleErrors(err, 'createRecordErrors', newProblem);
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
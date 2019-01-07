Encompass.AnswerNewComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {
  filesToBeUploaded: null,
  createAnswerError: null,
  isMissingRequiredFields: null,
  alert: Ember.inject.service('sweet-alert'),
  students: [],
  editor: null,
  findRecordErrors: [],
  uploadErrors: [],
  createRecordErrors: [],
  elementId: 'answer-new',
  contributors: [],
  constraints: {
    briefSummary: {
      presence: { allowEmpty: false },
      length: {
        maximum: 10000
      }
    },
    explanation: {
      presence: true
    }
  },

  didInsertElement: function() {
    // initialize quill editor
    const options = {
      debug: 'false',
      modules: {
        toolbar: [
        ['bold', 'italic', 'underline'],
        ['image'],
        ]
      },
      placeholder: 'Explain your ideas and how you figured them out...',
      theme: 'snow'
    };
    // eslint-disable-next-line no-unused-vars
    const quill = new window.Quill('#editor', options);

    if (this.priorAnswer) {
      //prefill form if revising
      const ans = this.priorAnswer;
      this.set('answer', ans.get('answer'));
      let explanation = ans.get('explanation');

      this.$('.ql-editor').html(explanation);

      let students = ans.get('students');
      this.set('contributors', students.map(s => s));

    } else {
      this.get('contributors').addObject(this.get('currentUser'));
    }
  },

  handleImage: function() {
    const that = this;
    return new Promise((resolve, reject) => {
      if (that.get('existingImageId')) {
        return resolve(that.get('existingImageId'));
      }
      if (that.filesToBeUploaded) {
        const uploadData = that.get('filesToBeUploaded');
        const formData = new FormData();
        for(let f of uploadData) {
          formData.append('photo', f);
        }

        let firstItem = uploadData[0];
        let isPDF = firstItem.type === 'application/pdf';

        if (isPDF) {
          return Ember.$.post({
            url: '/pdf',
            processData: false,
            contentType: false,
            data: formData
          }).then(function (res) {
            that.set('uploadResults', res.images);
            that.store.findRecord('image', res.images[0]._id).then((image) => {
              return resolve(image);
            })
            .catch((err) => {
              that.handleErrors(err, 'findRecordErrors');
            });
            // currently allowing multiple images to be uploaded but only saving
            // the first image url as the image in the answer doc
          })
          .catch((err) => {
            that.handleErrors(err, 'uploadErrors');
            return reject(err);
          });
        } else {
          return Ember.$.post({
            url: '/image',
            processData: false,
            contentType: false,
            data: formData
          }).then(function(res){
            that.set('uploadResults', res.images);
            that.store.findRecord('image', res.images[0]._id).then((image) => {
              return resolve(image);
            }).catch((err) => {
              that.handleErrors(err, 'findRecordErrors');
            });
            // currently allowing multiple images to be uploaded but only saving
            // the first image url as the image in the answer doc
          })
          .catch((err) => {
            that.handleErrors(err, 'uploadErrors');
            return reject(err);
          });
        }
    }

      return resolve(null);
    });
  },

  checkMissing: function() {
    const id = this.get('formId');
    let isMissing = this.get('validator').isMissingRequiredFields(id);
    this.set('isMissingRequiredFields', isMissing);
  },

  createAnswer: function() {
    const that = this;
    const answer = that.get('answer');
    const quillContent = this.$('.ql-editor').html();
    const explanation = quillContent.replace(/["]/g, "'");
    const priorAnswer = that.priorAnswer ? that.priorAnswer : null;
    const students = that.get('contributors');

    return this.handleImage().then((image) => {
      let imageData;
      let newImage;
      if (image) {
        imageData = image.get('imageData');
        newImage = `<img src='${imageData}'>`;
      }

      const records = students.map((student) => {
        return that.store.createRecord('answer', {
          createdBy: student,
          createDate: new Date(),
          answer: answer,
          explanation: explanation + newImage,
          assignment: that.assignment,
          isSubmitted: true,
          problem: that.problem,
          priorAnswer: priorAnswer,
          section: that.section,
          students: students,
        });
      });
      // additional uploaded image base 64 data was concatenated to explanation
      // so can delete image record
      return Promise.all(records.map((rec) => {
        let uploadedImages = this.get('uploadResults');
        if (uploadedImages) {
          uploadedImages.forEach((image) => {
            this.get('store').findRecord('image', image._id).then((image) => {
              image.destroyRecord();
            });
          });
        }
        return rec.save();
      }))
      .then((answers) => {
        const userId = that.get('currentUser.id');
        let yourAnswer = answers.filter((answer) => {
        return answer.get('createdBy.id') === userId;}).objectAt(0);

        that.get('handleCreatedAnswer')(yourAnswer);
        this.get('alert').showToast('success', 'Answer Created', 'bottom-end', 3000, false, null);
      })
        .catch((err) => {
          // do we need to roll back all recs that were created?
          that.handleErrors(err, 'createRecordErrors');
        });
    });
  },
  // Empty quill editor .html() property returns <p><br></p>
  // For quill to not be empty, there must either be some text or a student
  // must have uploaded an img so there must be an img tag
  isQuillValid: function() {
    let pText = this.$('.ql-editor p').text();
    if (pText.length > 0) {
      return true;
    }
    let content = this.$('.ql-editor').html();
    if (content.includes('<img')) {
      return true;
    }
    return false;
  },

  actions: {
    validate: function() {
      // remove existing errors
      const formErrors = ['briefSummaryErrors', 'explanationErrors'];
      for (let error of formErrors) {
        if (this.get(error)) {
          this.set(error, null);
        }
      }

      let isQuillValid = this.isQuillValid();
      let briefSummary = this.get('answer');
      let explanation = isQuillValid ? true : null;

      let values = {
        briefSummary,
        explanation
      };
      let constraints = this.get('constraints');

      let errors = window.validate(values, constraints);
      if (errors) {
        for (let key of Object.keys(errors)) {
          let errorProp = `${key}Errors`;
          this.set(errorProp, errors[key]);
        }
        return;
      }
      // no errors
      this.createAnswer();
    },

    cancelResponse: function() {
      this.get('cancelResponse')();
    },
    deleteImage: function () {
      this.set('existingImageId', null);
      this.set('imageData', null);
    },
    toggleAddStudentMessages() {
      if (this.get('addStudentError')) {
        this.set('addStudentError', false);
      }
      if (this.get('addedStudent')) {
        this.set('addedStudent', false);
      }
    },
    addStudent: function(student) {
      if (!student) {
        return;
      }

      let students = this.get('contributors');

      if (students.includes(student)) {
        this.set('userAlreadyInSection', true);
        return;
      }

      students.pushObject(student);
      this.get('alert').showToast('success', 'Student Added', 'bottom-end', 3000, false, null);
      // this.set('addedStudent', true);
    },
    removeStudent: function(student) {
      if (!student) {
        return;
      }
      let students = this.get('contributors');
      students.removeObject(student);
      this.get('alert').showToast('success', 'Student Removed', 'bottom-end', 3000, false, null);
    }
  }
});


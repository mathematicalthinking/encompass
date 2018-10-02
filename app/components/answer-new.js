Encompass.AnswerNewComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {
  filesToBeUploaded: null,
  createAnswerError: null,
  isMissingRequiredFields: null,
  requiredInputIds: [],
  validator: Ember.inject.service('form-validator'),
  alert: Ember.inject.service('sweet-alert'),
  students: [],
  editor: null,
  findRecordErrors: [],
  uploadErrors: [],
  createRecordErrors: [],
  elementId: 'answer-new',
  contributors: [],

  didInsertElement: function() {
    //prefill form if revising
    if (this.priorAnswer) {
      const ans = this.priorAnswer;
      this.set('answer', ans.get('answer'));
      let explanation = ans.get('explanation');

      this.$('.ql-editor').html(explanation);

      let students = ans.get('students');
      this.set('contributors', students.map(s => s));

    } else {
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
      var quill = new window.Quill('#editor', options);
      this.get('contributors').addObject(this.get('currentUser'));
    }

    let formId = 'form#newanswerform';
    this.set('formId', formId);
    this.set('requiredInputIds', ['answer', 'explantion']);

    let isMissing = this.checkMissing.bind(this);
    this.get('validator').initialize(formId, isMissing);
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

    if (!answer || !explanation) {
      this.set('isMissingRequiredFields', true);
      return;
    }

    return this.handleImage().then((image) => {
      const records = students.map((student) => {
        return that.store.createRecord('answer', {
          createdBy: student,
          createDate: new Date(),
          answer: answer,
          explanation: explanation,
          assignment: that.assignment,
          isSubmitted: true,
          problem: that.problem,
          priorAnswer: priorAnswer,
          section: that.section,
          students: students,
          additionalImage: image
        });
      });
      return Promise.all(records.map((rec) => {
        this.get('alert').showToast('success', 'Answer Created', 'bottom-end', 3000, false, null);
        return rec.save();
      }))
      .then((answers) => {
        const userId = that.get('currentUser.id');
        let yourAnswer = answers.filter((answer) => {
        return answer.get('createdBy.id') === userId;}).objectAt(0);
        return that.get('handleCreatedAnswer')(yourAnswer);
      })
        .catch((err) => {
          // do we need to roll back all recs that were created?
          that.handleErrors(err, 'createRecordErrors');
        });
    });
  },

  actions: {
    validate: function() {
      const that = this;
      return this.get('validator').validate(that.get('formId'))
      .then((res) => {
        console.log('res', res);
        if (1) {
          // proceed with answer creation
          this.createAnswer();
        } else {
          if (res.invalidInputs) {
            this.set('isMissingRequiredFields', true);
            return;
          }
        }
      })
      .catch(console.log);
    },

    cancelResponse: function() {
      this.get('cancelResponse')();
    },
    deleteImage: function () {
      this.set('existingImageId', null);
      this.set('imageData', null);
    },
    toggleAddStudentMessages() {
      console.log('in toggle');
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


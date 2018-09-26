Encompass.AnswerNewComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {
  filesToBeUploaded: null,
  createAnswerError: null,
  isMissingRequiredFields: null,
  requiredInputIds: [],
  validator: Ember.inject.service('form-validator'),
  students: [],
  editor: null,
  findRecordErrors: [],
  uploadErrors: [],
  createRecordErrors: [],
  elementId: 'answer-new',


  didInsertElement: function() {
    //prefill form if revising
    if (this.priorAnswer) {
      const ans = this.priorAnswer;
      this.set('answer', ans.get('answer'));
      this.set('explanation', ans.get('explanation'));
      if (ans.additionalImage) {
        this.set('students', ans.get('students'));
      }
    } else {
      this.get('students').addObject(this.get('currentUser'));
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
        console.log('filesToBeUploaded', that.filesToBeUploaded);
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

  didReceiveAttrs: function() {
    return this.get('section').get('students').then((students) => {
      this.set('sectionStudents', students);
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
    const students = that.get('students');

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
    addStudent: function() {
      const sectionStudents = this.get('sectionStudents');
      const username = this.get('student');
      //What should we be checking by? organization? section? or in the students array of the assignment? What if a student is in section but somehow not assigned to the assignment?
      const filtered = sectionStudents.filterBy('username', username);
      if (Ember.isEmpty(filtered)) {
        this.set('addStudentError', true);
        return;
      }
      this.get('students').addObject(filtered.objectAt(0));
      this.set('student', '');
      this.set('addedStudent', true);
    },
  }
});


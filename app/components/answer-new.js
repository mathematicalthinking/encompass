Encompass.AnswerNewComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  filesToBeUploaded: null,
  createAnswerError: null,
  isMissingRequiredFields: null,
  requiredInputIds: [],
  validator: Ember.inject.service('form-validator'),
  students: [],
  editor: null,
  // quill: new Quill('#editor', {
  //   debug: 'info',
  //   modules: {
  //     toolbar: [
  //       ['bold', 'italic', 'underline'],
  //       ['image'],
  //     ]
  //   },
  //   placeholder: 'Explain your ideas and how you figured them out...',
  //   theme: 'snow'
  // }),


  didInsertElement: function() {

    //prefill form if revising
    if (this.priorAnswer) {
      const ans = this.priorAnswer;
      this.set('answer', ans.get('answer'));
      this.set('explanation', ans.get('explanation'));
      if (ans.imageData) {
        this.set('imageData', ans.get('imageData'));
        this.set('isPdf', ans.get('isPdf'));
        this.set('existingImageId', ans.get('uploadedFileId'));
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
        return Ember.$.post({
          url: '/image',
          processData: false,
          contentType: false,
          data: formData
        }).then(function(res){
          that.set('uploadResults', res.images);
          // currently allowing multiple images to be uploaded but only saving
          // the first image url as the image in the answer doc
          return resolve(res.images[0]._id);
        })
        .catch((err) => {
          that.set('createAnswerError', err);
          return reject(err);
        });
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
    console.log('creating Answer');
    const createdBy = that.get('currentUser');
    const answer = that.get('answer');
    const explanation = this.$('.ql-editor').html();
    var parsed = explanation.replace(/["]/g, "'");
    const priorAnswer = that.priorAnswer ? that.priorAnswer : null;
    const students = that.get('students');

    return this.handleImage().then((imageId) => {
      console.log('imageId', imageId);
      return imageId;
    }).then((id) => {
      console.log('id', id);

      const records = students.map((student) => {
        console.log('stud', student);
        return that.store.createRecord('answer', {
          createdBy: student,
          createDate: new Date(),
          answer: answer,
          explanation: parsed,
          assignment: that.assignment,
          isSubmitted: true,
          problem: that.problem,
          priorAnswer: priorAnswer,
          section: that.section,
          students: students,
          uploadedFileId: id
        });
      });
      console.log('records', records);
      return Promise.all(records.map((rec) => {
        return rec.save();
      }))
      .then((answers) => {
        console.log('answer', answers);
        const userId = that.get('currentUser.id');
        console.log('userId', userId);
       let yourAnswer = answers.filter((answer) => {
        return answer.get('createdBy.id') === userId;       }).objectAt(0);

      return that.get('handleCreatedAnswer')(yourAnswer);

            //TODO: decide how to handle clearing form and whether to redirect to the created answer
            //that.get('validator').clearForm();
          })
          .catch((err) => {
            that.set('createAnswerError', err);
          });

    });

    // if (that.get('existingImageId')) {
    //  console.log('existingImageId', that.get('existingImageId'));
    //   createAnswerData.set('uploadedFileId', that.get('existingImageId'));
    // }

    // if (that.filesToBeUploaded) {
    //   console.log('filesToBeUploaded', that.filesToBeUploaded);
    //   const uploadData = that.get('filesToBeUploaded');
    //   const formData = new FormData();
    //   for(let f of uploadData) {
    //     formData.append('photo', f);
    //   }
    //   Ember.$.post({
    //     url: '/image',
    //     processData: false,
    //     contentType: false,
    //     data: formData
    //   }).then(function(res){
    //     that.set('uploadResults', res.images);
    //     // currently allowing multiple images to be uploaded but only saving
    //     // the first image url as the image in the answer doc
    //     createAnswerData.set('uploadedFileId', res.images[0]._id);
    //     createAnswerData.save()
    //       .then((answer) => {
    //         return that.get('handleCreatedAnswer')(answer);
    //       })
    //       .catch((err) => {
    //         that.set('createAnswerError', err);
    //       });
    //   }).catch(function(err){
    //     that.set('uploadError', err);
    //   });
    // } else {

        // }
      },

  actions: {
    validate: function() {
      console.log('validating');
      const that = this;
      return this.get('validator').validate(that.get('formId'))
      .then((res) => {
        console.log('res', res);
        if (1) {
          // proceed with answer creation
          console.log('Form is Valid!');
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

    logHtmlContent: function() {
      var editor = this.$('.ql-editor').html();
      var parsed = editor.replace(/["]/g, "'");

      console.log('content is', parsed);

    },
  }
});


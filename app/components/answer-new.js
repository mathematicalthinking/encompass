Encompass.AnswerNewComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {
  elementId: 'answer-new',
  alert: Ember.inject.service('sweet-alert'),
  utils: Ember.inject.service('utility-methods'),

  filesToBeUploaded: null,
  createAnswerError: null,
  isMissingRequiredFields: null,
  students: [],
  editor: null,
  findRecordErrors: [],
  uploadErrors: [],
  createRecordErrors: [],
  contributors: [],
  isCreatingAnswer: false,
  showLoadingMessage: false,

  quillEditorId: 'answer-new-editor',
  quillText: '',
  singleFileSizeLimit: 10485760, // 10MB
  explanationLengthLimit: 14680064, // `14MB

  constraints: {
    briefSummary: {
      presence: { allowEmpty: false },
      length: {
        maximum: 10000
      }
    },
    explanation: {
      presence: true,
    },
  },

  returnSizeDisplay(bytes) {
    if(bytes < 1024) {
      return bytes + ' bytes';
    } else if(bytes >= 1024 && bytes < 1048576) {
      return (bytes/1024).toFixed(1) + 'KB';
    } else if(bytes >= 1048576) {
      return (bytes/1048576).toFixed(1) + 'MB';
    }
  },

  totalSizeLimitDisplay: function() {
    return this.returnSizeDisplay(this.get('explanationLengthLimit'));
  }.property('explanationLengthLimit'),

  getOverSizedFileMsg(fileSize, fileName) {
    let limit = this.get('singleFileSizeLimit');

    let actualDisplay = this.returnSizeDisplay(fileSize);
    let limitDisplay = this.returnSizeDisplay(limit);

    return `The file ${fileName} (${actualDisplay}) was not accepted due to exceeding the size limit of ${limitDisplay}`;
  },

  tooLargeExplanationMsg: function() {
    return `The total size of your submission (text and/or images) exceeds the size limit of ${this.get('totalSizeLimitDisplay')}. Please remove or resize any large images and try again.`;
  }.property('totalSizeLimitDisplay'),

  createButtonDisplayText: function() {
    if (this.get('createButtonText')) {
      return this.get('createButtonText');
    }
    return 'Create Answer';
  }.property('createButtonText'),

  mainHeaderDisplayText: function() {
    if (this.get('mainHeaderText')) {
      return this.get('mainHeaderText');
    }
    return 'Create New Answer';
  }.property('mainHeaderText'),

  didInsertElement: function() {

    if (this.priorAnswer) {
      //prefill form if revising
      const ans = this.priorAnswer;
      this.set('answer', ans.get('answer'));
      let explanation = ans.get('explanation');

      this.set('explanationText', explanation);
      let students = ans.get('students');
      this.set('contributors', students.map(s => s));

    } else {
      this.get('contributors').addObject(this.get('currentUser'));
    }
  },

  willDestroyElement() {
    let propsToClear = ['isCreatingAnswer', 'showLoadingMessage'];
    propsToClear.forEach((prop) => {
      if (this.get(prop)) {
        this.set(prop, false);
      }
    });
    this._super(...arguments);
  },

  handleImages() {
      if (this.get('existingImageId')) {
        return Ember.RSVP.resolve(this.get('existingImageId'));
      }

      let filesToUpload = this.get('filesToBeUploaded');

      if (!filesToUpload) {
        return Ember.RSVP.resolve(null);
      }

      const formData = new FormData();

      for ( let f of filesToUpload ) {
        if (f.size > this.get('singleFileSizeLimit')) {
          this.set('overSizedFileError', this.getOverSizedFileMsg(f.size, f.name));
          return Ember.RSVP.reject('oversizedFile');
        } else {
          formData.append('photo', f);
        }
      }

      let firstItem = filesToUpload[0];
      let isPDF = firstItem.type === 'application/pdf';
      let postUrl = isPDF ? '/pdf' : '/image';
      let resultingImages;

      resultingImages = Ember.$.post({
        url: postUrl,
        processData: false,
        contentType: false,
        data: formData
      });

      return Ember.RSVP.resolve(resultingImages)
        .then((results) => {
          let images = results.images;
          this.get('store').pushPayload({images});
          return Ember.RSVP.resolve(images);
        })
        .catch((err) => {
          return Ember.RSVP.reject(err);
        });
  },

  handleLoadingMessage: function() {
    const that = this;
    if (this.get('isDestroyed') || this.get('isDestroying')) {
      return;
    }

    if (!this.get('isCreatingAnswer')) {
      this.set('showLoadingMessage', false);
      return;
    }
    Ember.run.later(function() {
      if (that.isDestroyed || that.isDestroying) {
        return;
      }
      that.set('showLoadingMessage', that.get('isCreatingAnswer'));
    }, 500);

  }.observes('isCreatingAnswer'),

  createAnswer: function() {
    this.set('isCreatingAnswer', true);

    const answer = this.get('answer'); // brief summary
    const quillContent = this.$('.ql-editor').html();
    let explanation = quillContent.replace(/["]/g, "'");
    const priorAnswer = this.priorAnswer ? this.priorAnswer : null;
    const students = this.get('contributors');

    return this.handleImages()
    .then((images) => {
      // json objects, not ember records
      if (images) {
        images.forEach((image) => {
          let imageData = image.imageData;
          if (imageData) {
            let url = `/api/images/file/${image._id}`;
            let tagString = `<img src='${url}'>`;
            explanation += tagString;
          }
        });
      }

      if (explanation.length > this.get('explanationLengthLimit')) {
        this.set('isExplanationTooLarge', true);
        this.set('isCreatingAnswer', false);

        return;
      }

      const records = students.map((student) => {
        return this.store.createRecord('answer', {
          createdBy: student,
          createDate: new Date(),
          answer: answer,
          explanation: explanation,
          assignment: this.assignment,
          isSubmitted: true,
          problem: this.problem,
          priorAnswer: priorAnswer,
          section: this.section,
          students: students,
          workspaceToUpdate: this.get('workspaceToUpdateId'),
        });
      });
      // additional uploaded image base 64 data was concatenated to explanation

      return Ember.RSVP.all(records.map((rec) => {
        return rec.save();
      }))
      .then((answers) => {
        const userId = this.get('currentUser.id');

        let yourAnswer = answers.find((answer) => {
          return answer.get('createdBy.id') === userId;
        });

        this.get('alert').showToast('success', 'Answer Created', 'bottom-end', 3000, false, null);

        this.get('handleCreatedAnswer')(yourAnswer);
      })
        .catch((err) => {
          // do we need to roll back all recs this were created?
          if (!this.get('isDestroying') && !this.get('isDestroyed')) {
            this.set('isCreatingAnswer', false);
          }
          this.handleErrors(err, 'createRecordErrors');
        });
    })
    .catch((err) => {
      if (!this.get('isDestroying') && !this.get('isDestroyed')) {
        this.set('isCreatingAnswer', false);
      }
      if (err === 'oversizedFile') {
        return;
      }
    });
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

      let isQuillValid = !this.get('isQuillEmpty');
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
    },
    removeStudent: function(student) {
      if (!student) {
        return;
      }
      let students = this.get('contributors');
      students.removeObject(student);
      this.get('alert').showToast('success', 'Student Removed', 'bottom-end', 3000, false, null);
    },
    updateQuillText(content, isEmpty, isOverLengthLimit) {
      this.set('quillText', content);
      this.set('isQuillEmpty', isEmpty);
      this.set('isQuillTooLong', isOverLengthLimit);
    }
  }
});


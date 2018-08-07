Encompass.AnswerNewComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  filesToBeUploaded: null,
  createAnswerError: null,
  isMissingRequiredFields: null,
  requiredInputIds: [],
  validator: Ember.inject.service('form-validator'),

  didInsertElement: function() {

    //prefill form if revising
    if (this.priorAnswer) {
      const ans = this.priorAnswer;
      this.set('answer', ans.get('answer'));
      this.set('explanation', ans.get('explanation'));
    }
    let formId = 'form#newanswerform';
    this.set('formId', formId);
    this.set('requiredInputIds', ['answer', 'explantion']);

    let isMissing = this.checkMissing.bind(this);
    this.get('validator').initialize(formId, isMissing);
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
    const explanation = that.get('explanation');
    const priorAnswer = that.priorAnswer ? that.priorAnswer : null;

    let createAnswerData =   that.store.createRecord('answer', {
      createdBy: createdBy,
      createDate: new Date(),
      answer: answer,
      explanation: explanation,
      assignment: that.assignment,
      isSubmitted: true,
      problem: that.problem,
      priorAnswer: priorAnswer,
      section: that.section
    });

    if (that.filesToBeUploaded) {
      console.log('filesToBeUploaded', that.filesToBeUploaded);
      const uploadData = that.get('filesToBeUploaded');
      const formData = new FormData();
      for(let f of uploadData) {
        formData.append('photo', f);
      }
      Ember.$.post({
        url: '/image',
        processData: false,
        contentType: false,
        data: formData
      }).then(function(res){
        that.set('uploadResults', res.images);
        // currently allowing multiple images to be uploaded but only saving
        // the first image url as the image in the answer doc
        createAnswerData.set('uploadedFileId', res.images[0]._id);
        createAnswerData.save()
          .then((answer) => {
            that.sendAction('toAnswerInfo', answer);
          })
          .catch((err) => {
            that.set('createAnswerError', err);
          });
      }).catch(function(err){
        that.set('uploadError', err);
      });
    } else {
      createAnswerData.save()
          .then((answer) => {
            return that.get('handleCreatedAnswer')(answer);

            //TODO: decide how to handle clearing form and whether to redirect to the created answer
            //that.get('validator').clearForm();
          })
          .catch((err) => {
            that.set('createAnswerError', err);
          });
        }
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
    }
  }
});
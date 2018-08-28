Encompass.ProblemNewComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  filesToBeUploaded: null,
  createProblemError: null,
  isMissingRequiredFields: null,
  isPublic: null,
  privacySetting: null,
  checked: true,
  validator: Ember.inject.service('form-validator'),

  didInsertElement: function() {
    let formId = 'form#newproblemform';
    this.set('formId', formId);

    let isMissing = this.checkMissing.bind(this);
    this.get('validator').initialize(formId, isMissing);
  },

  checkMissing: function() {
    const id = this.get('formId');
    let isMissing = this.get('validator').isMissingRequiredFields(id);
    this.set('isMissingRequiredFields', isMissing);
  },

  createProblem: function() {
    var that = this;
    var createdBy = that.get('currentUser');
    var title = that.get('title');
    var text = that.get('text');
    //var categories = [];
    var additionalInfo = that.get('additionalInfo');
    var privacySetting = that.get('privacySetting');
    var currentUser = that.get('currentUser');
    var organization = currentUser.get('organization');

    //var imageUrl = null;

    var createProblemData = that.store.createRecord('problem', {
      createdBy: createdBy,
      createDate: new Date(),
      title: title,
      text: text,
      // categories: categories,
      additionalInfo: additionalInfo,
      privacySetting: privacySetting,
      organization: organization,
      //imageUrl: imageUrl
    });

    if (that.filesToBeUploaded) {
      console.log('filesToBeUploaded', that.filesToBeUploaded);
      var uploadData = that.get('filesToBeUploaded');
      var formData = new FormData();
      for(let f of uploadData) {
        formData.append('photo', f);
      }
      let firstItem = uploadData[0];
      let isPDF = firstItem.type === 'application/pdf';

      if (isPDF) {
        Ember.$.post({
          url: '/pdf',
          processData: false,
          contentType: false,
          data: formData,
          createdBy: createdBy
        }).then(function (res) {
          that.set('uploadResults', res.images);
          // currently allowing multiple images to be uploaded but only saving
          // the first image url as the image in the problem doc
          createProblemData.set('imageId', res.images[0]._id);
          createProblemData.save()
            .then((problem) => {
              that.sendAction('toProblemInfo', problem);
            })
            .catch((err) => {
              that.set('createProblemError', err);
            });
        }).catch(function (err) {
          that.set('uploadError', err);
        });
      } else {
        Ember.$.post({
          url: '/image',
          processData: false,
          contentType: false,
          data: formData,
          createdBy: createdBy
        }).then(function (res) {
          that.set('uploadResults', res.images);
          // currently allowing multiple images to be uploaded but only saving
          // the first image url as the image in the problem doc
          createProblemData.set('imageId', res.images[0]._id);
          createProblemData.save()
            .then((problem) => {
              that.sendAction('toProblemInfo', problem);
            })
            .catch((err) => {
              that.set('createProblemError', err);
            });
        }).catch(function (err) {
          that.set('uploadError', err);
        });
      }
    } else {
      createProblemData.save()
        .then((problem) => {
          that.sendAction('toProblemInfo', problem);
          //TODO: decide how to handle clearing form and whether to redirect to the created problem
          //that.get('validator').clearForm();
        })
        .catch((err) => {
          that.set('createProblemError', err);
        });
      }
    },




  actions: {
    radioSelect: function (value) {
      this.set('privacySetting', value);
      console.log('privacy setting now is ', this.get('privacySetting'));
    },

    validate: function() {
      var that = this;
      return this.get('validator').validate(that.get('formId'))
      .then((res) => {
        console.log('res', res);
        if (res.isValid) {
          // proceed with problem creation
          console.log('Form is Valid!');
          this.createProblem();
        } else {
          if (res.invalidInputs) {
            this.set('isMissingRequiredFields', true);
            return;
          }
        }
      })
      .catch(console.log);
    },
  }
});


Encompass.ProblemNewComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  filesToBeUploaded: null,
  createProblemError: null,
  isMissingRequiredFields: null,
  isPublic: null,
  validator: Ember.inject.service('form-validator'),

  didInsertElement: function() {
    let formId = 'form#problem';
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
    console.log('creating Problem');
    var createdBy = that.get('currentUser');
    var title = that.get('title');
    var text = that.get('text');
    //var categories = [];
    var additionalInfo = that.get('additionalInfo');
    var isPublic = that.get('isPublic');
    //var imageUrl = null;

    var createProblemData =   that.store.createRecord('problem', {
      createdBy: createdBy,
      createDate: new Date(),
      title: title,
      text: text,
      // categories: categories,
      additionalInfo: additionalInfo,
      isPublic: isPublic,
      //imageUrl: imageUrl
    });

    if (that.filesToBeUploaded) {
      console.log('filesToBeUploaded', that.filesToBeUploaded);
      var uploadData = that.get('filesToBeUploaded');
      var formData = new FormData();
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
        // the first image url as the image in the problem doc
        createProblemData.set('imageId', res.images[0]._id);
        createProblemData.save()
          .catch((err) => {
            that.set('createProblemError', err);
          });
      }).catch(function(err){
        that.set('uploadError', err);
      });
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
      this.set('isPublic', value);
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


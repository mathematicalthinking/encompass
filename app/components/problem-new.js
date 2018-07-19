Encompass.ProblemNewComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  filesToBeUploaded: null,
  createdProblem: null,
  createProblemError: null,
  invalidRequiredFields: [],
  isMissingRequiredFields: null,
  validator: Ember.inject.service('form-validator'),

  didInsertElement: function() {
    let validator = this.get('validator');
    let formId = 'form#problem';
    this.set('formId', formId);
    const reqs = validator.getRequiredInputs;

    let isMissing = this.checkMissing.bind(this);
    validator.setupListeners(formId, isMissing);
    this.checkMissing();
  },

  checkMissing: function() {
    console.log('in checkMissing');
    const id = this.get('formId');
    let isMissing = this.get('validator').isMissingRequiredFields(id);
    console.log('ismissing: ', isMissing);
    this.set('isMissingRequiredFields', isMissing);
  },

  actions: {
    radioSelect: function (value) {
      this.set('isPublic', value);
    },

    createProblem: function() {
      var that = this;
      return that.get('validator').validate(that.get('formId'))
      .then((res) => {
        if (res.isValid) {
          // proceed with problem creation
          console.log('Form is Valid!');
        } else {
          if (res.didSetRequiredFieldErrors) {
            that.set('isMissingRequiredFields', true);
            return;
          }
        }
      })
      .catch(console.log);
      // var createdBy = that.get('currentUser');
      // var title = that.get('title');
      // var text = that.get('text');
      // //var categories = [];
      // var additionalInfo = that.get('additionalInfo');
      // var isPublic = that.get('isPublic');
      // var imageUrl = null;

      // var createProblemData =   that.store.createRecord('problem', {
      //   createdBy: createdBy,
      //   createDate: new Date(),
      //   title: title,
      //   text: text,
      //   // categories: categories,
      //   additionalInfo: additionalInfo,
      //   isPublic: isPublic,
      //   imageUrl: imageUrl
      // });

      // if (that.filesToBeUploaded) {
      //   console.log('filesToBeUploaded', that.filesToBeUploaded);
      //   var uploadData = that.get('filesToBeUploaded');
      //   var formData = new FormData();
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
      //     // the first image url as the image in the problem doc
      //     createProblemData.set('imageId', res.images[0]._id);
      //     createProblemData.save()
      //       .then((prob) => {
      //         that.set('createdProblem', prob);
      //       })
      //       .catch((err) => {
      //         that.set('createProblemError', err);
      //       });
      //   }).catch(function(err){
      //     that.set('uploadError', err);
      //   });
      // } else {
      //   createProblemData.save()
      //       .then((prob) => {
      //         that.set('createdProblem', prob);
      //       })
      //       .catch((err) => {
      //         that.set('createProblemError', err);
      //       });
      //     }
        }
      }
});


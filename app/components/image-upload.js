Encompass.ImageUploadComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'image-upload',
  isHidden: false,
  //uploadedFiles: null,
  filesToBeUploaded: null,
  uploadResults: null,
  uploadError: null,
  missingFilesError: false,

  actions: {
    uploadImages: function() {
      var that = this;
      var currentUser = that.get('currentUser');
      var uploadData = that.get('filesToBeUploaded');
      if (!uploadData) {
        this.set('missingFilesError', true);
        return;
      }
      var formData = new FormData();
      console.log('formData is', formData);
      for(let f of uploadData) {
        formData.append('photo', f);
      }
      Ember.$.post({
              url: '/image',
              processData: false,
              contentType: false,
              createdBy: currentUser,
              data: formData
            }).then(function(res){
              that.set('uploadResults', res.images);
            }).catch(function(err){
              that.set('uploadError', err);
            });
    },

    updateFiles: function(event) {
      if (this.get('missingFilesError')) {
        this.set('missingFilesError', false);
      }
      this.set('filesToBeUploaded', event.target.form.firstElementChild.files);
    }
  }
});
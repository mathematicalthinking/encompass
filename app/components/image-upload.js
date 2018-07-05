Encompass.ImageUploadComponent = Ember.Component.extend({
  isHidden: false,
  //uploadedFiles: null,
  //filesToBeUploaded: null,
  uploadResults: null,
  uploadError: null,

  actions: {
    uploadImages: function() {
      var that = this;
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
            }).catch(function(err){
              that.set('uploadError', err);
            });
    },

    updateFiles: function(event) {
      this.set('filesToBeUploaded', event.target.form.firstElementChild.files);
    }
  }
});
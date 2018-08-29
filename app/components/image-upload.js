Encompass.ImageUploadComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'image-upload',
  isHidden: false,
  //uploadedFiles: null,
  filesToBeUploaded: null,
  uploadResults: null,
  uploadError: null,
  missingFilesError: false,
  acceptMultiple: false,


  uploadImage: function (currentUser, formData) {
    const that = this;
    return Ember.$.post({
      url: '/image',
      processData: false,
      contentType: false,
      createdBy: currentUser,
      data: formData
    }).then(function (res) {
      console.log('res from image API', res);
      that.set('uploadedImages', res.images);
      return res.images;
    }).catch(function (err) {
      that.set('uploadError', err);
      return err;
    });
  },

  uploadPdf: function (currentUser, formData) {
    console.log('in uploadPdf');
    const that = this;
    return Ember.$.post({
      url: '/pdf',
      processData: false,
      contentType: false,
      data: formData,
      createdBy: currentUser
    }).then(function (res) {
      console.log('res from pdf api', res);
      that.set('uploadedPdfs', res.images);
      return res.images;
    }).catch(function (err) {
      that.set('uploadError', err);
      return err;
    });
  },

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
      var pdfFormData = new FormData();
      var imageCount = 0;
      var pdfCount = 0;
      for (let f of uploadData) {
        if (f.type === 'application/pdf') {
          pdfFormData.append('photo', f);
          pdfCount++;
        } else {
          formData.append('photo', f);
          imageCount++;
        }
      }
      if (imageCount > 0) {
        return this.uploadImage(currentUser, formData).then((res) => {
          console.log('res image', res);
          if (pdfCount > 0) {
            return this.uploadPdf(currentUser, pdfFormData).then((res) => {
              console.log('res pdf', res);
              let results = this.get('uploadedPdfs').concat(this.get('uploadedImages'));
              this.set('uploadResults', results);
            })
            .catch(console.log);
          }
        });
      } else if (pdfCount > 0) {
        return this.uploadPdf(currentUser, pdfFormData).then((res) => {
          console.log('res', res);
        })
        .catch(console.log);
      }

    },

    updateFiles: function(event) {
      if (this.get('missingFilesError')) {
        this.set('missingFilesError', false);
      }
      this.set('filesToBeUploaded', event.target.form.firstElementChild.files);
    }
  }
});




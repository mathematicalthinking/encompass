Encompass.ImageUploadComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {
  elementId: 'image-upload',
  isHidden: false,
  //uploadedFiles: null,
  filesToBeUploaded: null,
  uploadResults: null,
  uploadError: null,
  missingFilesError: false,
  acceptMultiple: false,
  uploadErrors: [],

  handleLoadingMessage: function() {
    const that = this;
    if (!this.get('isUploading')) {
      this.set('showLoadingMessage', false);
      return;
    }
    Ember.run.later(function() {
      if (that.isDestroyed || that.isDestroying) {
        return;
      }
      that.set('showLoadingMessage', true);
    }, 500);

  }.observes('isUploading'),


  uploadImage: function (currentUser, formData) {
    const that = this;
    return Ember.$.post({
      url: '/image',
      processData: false,
      contentType: false,
      createdBy: currentUser,
      data: formData
    }).then((res) => {
      that.set('uploadedImages', res.images);
      return res.images;
    }).catch((err) => {
      that.set('isUploading', false);
      that.handleErrors(err, 'uploadErrors', err);
      return err;
    });
  },

  uploadPdf: function (currentUser, formData) {
    const that = this;
    return Ember.$.post({
      url: '/pdf',
      processData: false,
      contentType: false,
      data: formData,
      createdBy: currentUser
    }).then(function (res) {
      that.set('uploadedPdfs', res.images);
      return res.images;
    }).catch((err) => {
      that.set('isUploading', false);
      that.handleErrors(err, 'uploadErrors', err);
      return;
    });
  },

  actions: {
    uploadImages: function() {
      const that = this;
      const currentUser = that.get('currentUser');
      const uploadData = that.get('filesToBeUploaded');
      if (!uploadData) {
        this.set('isUploading', false);
        this.set('missingFilesError', true);
        return;
      }
      this.set('isUploading', true);

      let formData = new FormData();
      let pdfFormData = new FormData();
      let imageCount = 0;
      let pdfCount = 0;

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
          if (pdfCount > 0) {
            return this.uploadPdf(currentUser, pdfFormData).then((res) => {
              let results;
              if (this.get('uploadedPdfs') && this.get('uploadedImages')) {
                results = this.get('uploadedPdfs').concat(this.get('uploadedImages'));
                this.set('isUploading', false);
                this.set('uploadResults', results);
              }
            });
          } else {
            this.set('isUploading', false);
            this.set('uploadResults', this.get('uploadedImages'));
          }
        });
      } else if (pdfCount > 0) {
        return this.uploadPdf(currentUser, pdfFormData).then((res) => {
          this.set('isUploading', false);
          this.set('uploadResults', this.get('uploadedPdfs'));
        });
      }
    },

    updateFiles: function(event) {
      if (this.get('missingFilesError')) {
        this.set('missingFilesError', false);
      }
      this.set('filesToBeUploaded', event.target.form.firstElementChild.files);
      if (this.get('storeFiles')) {
        this.get('storeFiles')(event.target.form.firstElementChild.files);
      }
    },
  }
});




Encompass.ImageUploadComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {
  elementId: 'image-upload',

  alert: Ember.inject.service('sweet-alert'),
  store: Ember.inject.service(),

  isHidden: false,
  //uploadedFiles: null,
  filesToBeUploaded: null,
  uploadResults: null,
  uploadError: null,
  missingFilesError: false,
  acceptMultiple: false,
  uploadErrors: [],
  singleFileSizeLimit: 10485760, // 10MB
  totalPdfSizeLimit: 52428800, // 50MB
  totalImageSizeLimit: 52428800, // 50MB

  didReceiveAttrs() {
    let acceptableFileTypes = 'image/png,image/jpeg,application/pdf';
    if (this.get('isPdfOnly')) {
      acceptableFileTypes = 'application/pdf';
    }
    this.set('acceptableFileTypes', acceptableFileTypes);
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

  getOverSizedFileMsg(fileSize, fileName) {
    let limit = this.get('singleFileSizeLimit');

    let actualDisplay = this.returnSizeDisplay(fileSize);
    let limitDisplay = this.returnSizeDisplay(limit);

    return `The file ${fileName} (${actualDisplay}) was not accepted due to exceeding the size limit of ${limitDisplay}`;
  },

  overPdfLimitMsg: function() {
    let limit = this.get('totalPdfSizeLimit');
    let actual = this.get('totalPdfSize');
    let actualDisplay = this.returnSizeDisplay(actual);
    let limitDisplay = this.returnSizeDisplay(limit);

    return `Sorry, the total size of your PDF uploads (${actualDisplay}) exceeds the maximum of ${limitDisplay}`;
  }.property('totalPdfSizeLimit', 'totalPdfSize'),

  overImageLimitMsg: function() {
    let limit = this.get('totalImageSizeLimit');
    let actual = this.get('totalImageSize');
    let actualDisplay = this.returnSizeDisplay(actual);
    let limitDisplay = this.returnSizeDisplay(limit);

    return `Sorry, the total size of your image uploads (${actualDisplay}) exceeds the maximum of ${limitDisplay}`;
  }.property('totalImageSizeLimit', 'totalImageSize'),

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
      that.set('showLoadingMessage', that.get('isUploading'));
    }, 500);

  }.observes('isUploading'),

  uploadImage: function (currentUser, formData) {
    const that = this;
    return Ember.$.post({
      url: '/image',
      processData: false,
      contentType: false,
      // createdBy: currentUser,
      data: formData
    }).then((res) => {
      let images = res.images;
      that.set('uploadedImages', images);
      that.get('store').pushPayload({images});

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
      // createdBy: currentUser
    }).then(function (res) {
      let images = res.images;
      that.set('uploadedPdfs', images);
      that.get('store').pushPayload({images});
      return res.images;
    }).catch((err) => {
      that.set('isUploading', false);
      that.handleErrors(err, 'uploadErrors', err);
      return;
    });
  },

  totalPdfSize: function() {
    let total = 0;
    let files = this.get('filesToBeUploaded');
    if (!files) {
      return total;
    }

    for (let f of files) {
      if (f.type === `application/pdf`) {
        total += f.size;
      }
    }
    return total;
  }.property('filesToBeUploaded'),

  totalImageSize: function() {
    let total = 0;
    let files = this.get('filesToBeUploaded');
    if (!files) {
      return total;
    }

    for (let f of files) {
      if (f.type !== `application/pdf`) {
        total += f.size;
      }
    }
    return total;
  }.property('filesToBeUploaded'),

  isOverPdfLimit: function() {
    return this.get('totalPdfSize') > this.get('totalPdfSizeLimit');
  }.property('totalPdfSize', 'totalPdfSizeLimit'),

  isOverImageLimit: function() {
    return this.get('totalImageSize') > this.get('totalImageSizeLimit');
  }.property('totalImageSize', 'totalImageSizeLimit'),

  resetFileInput() {
    let input = this.$('input.image-upload');
    if (input) {
      this.set('filesToBeUploaded', null);
      input.val('');
    }
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
      if (this.get('isOverPdfLimit') || this.get('isOverImageLimit')) {
        this.set('isUploading', false);
        this.set('isOverSizeLimit', true);
        return;
      }
      this.set('isUploading', true);

      let formData = new FormData();
      let pdfFormData = new FormData();

      let imageCount = 0;
      let pdfCount = 0;

      for (let f of uploadData) {
        let fileSize = f.size;
        if (fileSize > this.get('singleFileSizeLimit')) {
          this.set('isUploading', false);
          this.set('overSizedFileError', this.getOverSizedFileMsg(f.size, f.name));
          this.set('filesToBeUploaded', null);
          return;
        } else if (f.type === 'application/pdf') {
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
                let fileModifier = results.length === 1 ? 'file' : 'files';

                let msg = `Uploaded ${results.length} ${fileModifier} successfully`;
                this.get('alert').showToast('success', msg, 'bottom-end', 3000, false, null);
                if (this.get('handleUploadResults')) {
                  this.get('handleUploadResults')(results);
                }
                this.set('uploadResults', results);
                if (this.get('doResetFilesAfterUpload')) {
                 this.resetFileInput();
                }
              }
            });
          } else {
            this.set('isUploading', false);

            let images = this.get('uploadedImages');
            let fileModifier = images.length === 1 ? 'file' : 'files';

            let msg = `Uploaded ${images.length} ${fileModifier} successfully`;
            this.get('alert').showToast('success', msg, 'bottom-end', 3000, false, null);
            if (this.get('handleUploadResults')) {
              this.get('handleUploadResults')(images);
            }
            this.set('uploadResults', this.get('uploadedImages'));
            if (this.get('doResetFilesAfterUpload')) {
              this.resetFileInput();
            }
          }
        });
      } else if (pdfCount > 0) {
        return this.uploadPdf(currentUser, pdfFormData).then((res) => {
          this.set('isUploading', false);

          let pdfs = this.get('uploadedPdfs');

          let fileModifier = pdfs.length === 1 ? 'file' : 'files';

          let msg = `Uploaded ${pdfs.length} ${fileModifier} successfully`;
          this.get('alert').showToast('success', msg, 'bottom-end', 3000, false, null);
          if (this.get('handleUploadResults')) {
            this.get('handleUploadResults')(pdfs);
          }
          this.set('uploadResults', this.get('uploadedPdfs'));
          if (this.get('doResetFilesAfterUpload')) {
            this.resetFileInput();
          }
        });
      }
    },

    updateFiles(event) {
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




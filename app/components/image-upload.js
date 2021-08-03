import Component from '@ember/component';
import { computed, observer } from '@ember/object';
import { later } from '@ember/runloop';
import { inject as service } from '@ember/service';
import $ from 'jquery';
import CurrentUserMixin from '../mixins/current_user_mixin';
import ErrorHandlingMixin from '../mixins/error_handling_mixin';

export default Component.extend(CurrentUserMixin, ErrorHandlingMixin, {
  elementId: 'image-upload',

  alert: service('sweet-alert'),
  store: service(),

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
    if (this.isPdfOnly) {
      acceptableFileTypes = 'application/pdf';
    }
    this.set('acceptableFileTypes', acceptableFileTypes);
  },

  returnSizeDisplay(bytes) {
    if (bytes < 1024) {
      return bytes + ' bytes';
    } else if (bytes >= 1024 && bytes < 1048576) {
      return (bytes / 1024).toFixed(1) + 'KB';
    } else if (bytes >= 1048576) {
      return (bytes / 1048576).toFixed(1) + 'MB';
    }
  },

  getOverSizedFileMsg(fileSize, fileName) {
    let limit = this.singleFileSizeLimit;

    let actualDisplay = this.returnSizeDisplay(fileSize);
    let limitDisplay = this.returnSizeDisplay(limit);

    return `The file ${fileName} (${actualDisplay}) was not accepted due to exceeding the size limit of ${limitDisplay}`;
  },

  overPdfLimitMsg: computed('totalPdfSizeLimit', 'totalPdfSize', function () {
    let limit = this.totalPdfSizeLimit;
    let actual = this.totalPdfSize;
    let actualDisplay = this.returnSizeDisplay(actual);
    let limitDisplay = this.returnSizeDisplay(limit);

    return `Sorry, the total size of your PDF uploads (${actualDisplay}) exceeds the maximum of ${limitDisplay}`;
  }),

  overImageLimitMsg: computed(
    'totalImageSizeLimit',
    'totalImageSize',
    function () {
      let limit = this.totalImageSizeLimit;
      let actual = this.totalImageSize;
      let actualDisplay = this.returnSizeDisplay(actual);
      let limitDisplay = this.returnSizeDisplay(limit);

      return `Sorry, the total size of your image uploads (${actualDisplay}) exceeds the maximum of ${limitDisplay}`;
    }
  ),

  handleLoadingMessage: observer('isUploading', function () {
    const that = this;
    if (!this.isUploading) {
      this.set('showLoadingMessage', false);
      return;
    }
    later(function () {
      if (that.isDestroyed || that.isDestroying) {
        return;
      }
      that.set('showLoadingMessage', that.get('isUploading'));
    }, 500);
  }),

  uploadImage: function (currentUser, formData) {
    const that = this;
    return $.post({
      url: '/image',
      processData: false,
      contentType: false,
      // createdBy: currentUser,
      data: formData,
    })
      .then((res) => {
        let images = res.images;
        that.set('uploadedImages', images);
        that.get('store').pushPayload({ images });

        return res.images;
      })
      .catch((err) => {
        that.set('isUploading', false);
        that.handleErrors(err, 'uploadErrors', err);
        return err;
      });
  },

  uploadPdf: function (currentUser, formData) {
    const that = this;
    return $.post({
      url: '/pdf',
      processData: false,
      contentType: false,
      data: formData,
      // createdBy: currentUser
    })
      .then(function (res) {
        let images = res.images;
        that.set('uploadedPdfs', images);
        that.get('store').pushPayload({ images });
        return res.images;
      })
      .catch((err) => {
        that.set('isUploading', false);
        that.handleErrors(err, 'uploadErrors', err);
        return;
      });
  },

  totalPdfSize: computed('filesToBeUploaded', function () {
    let total = 0;
    let files = this.filesToBeUploaded;
    if (!files) {
      return total;
    }

    for (let f of files) {
      if (f.type === `application/pdf`) {
        total += f.size;
      }
    }
    return total;
  }),

  totalImageSize: computed('filesToBeUploaded', function () {
    let total = 0;
    let files = this.filesToBeUploaded;
    if (!files) {
      return total;
    }

    for (let f of files) {
      if (f.type !== `application/pdf`) {
        total += f.size;
      }
    }
    return total;
  }),

  isOverPdfLimit: computed('totalPdfSize', 'totalPdfSizeLimit', function () {
    return this.totalPdfSize > this.totalPdfSizeLimit;
  }),

  isOverImageLimit: computed(
    'totalImageSize',
    'totalImageSizeLimit',
    function () {
      return this.totalImageSize > this.totalImageSizeLimit;
    }
  ),

  resetFileInput() {
    let input = this.$('input.image-upload');
    if (input) {
      this.set('filesToBeUploaded', null);
      input.val('');
    }
  },

  actions: {
    uploadImages: function () {
      const that = this;
      const currentUser = that.get('currentUser');
      const uploadData = that.get('filesToBeUploaded');
      if (!uploadData) {
        this.set('isUploading', false);
        this.set('missingFilesError', true);
        return;
      }
      if (this.isOverPdfLimit || this.isOverImageLimit) {
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
        if (fileSize > this.singleFileSizeLimit) {
          this.set('isUploading', false);
          this.set(
            'overSizedFileError',
            this.getOverSizedFileMsg(f.size, f.name)
          );
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
              if (this.uploadedPdfs && this.uploadedImages) {
                results = this.uploadedPdfs.concat(this.uploadedImages);
                this.set('isUploading', false);
                let fileModifier = results.length === 1 ? 'file' : 'files';

                let msg = `Uploaded ${results.length} ${fileModifier} successfully`;
                this.alert.showToast(
                  'success',
                  msg,
                  'bottom-end',
                  3000,
                  false,
                  null
                );
                if (this.handleUploadResults) {
                  this.handleUploadResults(results);
                }
                this.set('uploadResults', results);
                if (this.doResetFilesAfterUpload) {
                  this.resetFileInput();
                }
              }
            });
          } else {
            this.set('isUploading', false);

            let images = this.uploadedImages;
            let fileModifier = images.length === 1 ? 'file' : 'files';

            let msg = `Uploaded ${images.length} ${fileModifier} successfully`;
            this.alert.showToast(
              'success',
              msg,
              'bottom-end',
              3000,
              false,
              null
            );
            if (this.handleUploadResults) {
              this.handleUploadResults(images);
            }
            this.set('uploadResults', this.uploadedImages);
            if (this.doResetFilesAfterUpload) {
              this.resetFileInput();
            }
          }
        });
      } else if (pdfCount > 0) {
        return this.uploadPdf(currentUser, pdfFormData).then((res) => {
          this.set('isUploading', false);

          let pdfs = this.uploadedPdfs;

          let fileModifier = pdfs.length === 1 ? 'file' : 'files';

          let msg = `Uploaded ${pdfs.length} ${fileModifier} successfully`;
          this.alert.showToast('success', msg, 'bottom-end', 3000, false, null);
          if (this.handleUploadResults) {
            this.handleUploadResults(pdfs);
          }
          this.set('uploadResults', this.uploadedPdfs);
          if (this.doResetFilesAfterUpload) {
            this.resetFileInput();
          }
        });
      }
    },

    updateFiles(event) {
      if (this.missingFilesError) {
        this.set('missingFilesError', false);
      }

      this.set('filesToBeUploaded', event.target.form.firstElementChild.files);
      if (this.storeFiles) {
        this.storeFiles(event.target.form.firstElementChild.files);
      }
    },
  },
});

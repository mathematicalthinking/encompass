import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { later } from '@ember/runloop';
export default class ImageUploadComponent extends Component {
  @service('sweet-alert') alert;
  @service store;
  @service currentUser;
  @service errorHandling;

  @tracked isHidden = false;
  @tracked filesToBeUploaded = null;
  @tracked uploadResults = null;
  @tracked uploadError = null;
  @tracked missingFilesError = false;
  @tracked acceptMultiple = false;
  @tracked uploadErrors = [];
  @tracked singleFileSizeLimit = 10485760; // 10MB
  @tracked totalPdfSizeLimit = 52428800; // 50MB
  @tracked totalImageSizeLimit = 52428800; // 50MB
  @tracked acceptableFileTypes = this.args.isPdfOnly
    ? 'application/pdf'
    : 'image/png,image/jpeg,application/pdf';
  @tracked showLoadingMessage = false;
  loadingMessageTimer = null;
  _fileInputEl = null;

  returnSizeDisplay(bytes) {
    if (bytes < 1024) {
      return bytes + ' bytes';
    } else if (bytes >= 1024 && bytes < 1048576) {
      return (bytes / 1024).toFixed(1) + 'KB';
    } else if (bytes >= 1048576) {
      return (bytes / 1048576).toFixed(1) + 'MB';
    }
  }

  getOverSizedFileMsg(fileSize, fileName) {
    let limit = this.singleFileSizeLimit;

    let actualDisplay = this.returnSizeDisplay(fileSize);
    let limitDisplay = this.returnSizeDisplay(limit);

    return `The file ${fileName} (${actualDisplay}) was not accepted due to exceeding the size limit of ${limitDisplay}`;
  }

  get overPdfLimitMsg() {
    let limit = this.totalPdfSizeLimit;
    let actual = this.totalPdfSize;
    let actualDisplay = this.returnSizeDisplay(actual);
    let limitDisplay = this.returnSizeDisplay(limit);

    return `Sorry, the total size of your PDF uploads (${actualDisplay}) exceeds the maximum of ${limitDisplay}`;
  }

  get overImageLimitMsg() {
    let limit = this.totalImageSizeLimit;
    let actual = this.totalImageSize;
    let actualDisplay = this.returnSizeDisplay(actual);
    let limitDisplay = this.returnSizeDisplay(limit);

    return `Sorry, the total size of your image uploads (${actualDisplay}) exceeds the maximum of ${limitDisplay}`;
  }

  uploadImage(formData) {
    return fetch('/image', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((res) => {
        let images = res.images;
        this.uploadedImages = images;
        this.store.pushPayload({ images });

        return res.images;
      })
      .catch((err) => {
        this.setShowLoadingMessage(false);
        this.errorHandling.handleErrors(err, 'uploadErrors');
        return err;
      });
  }

  @action
  async uploadPdf(formData) {
    // Show a loading state if needed
    this.setShowLoadingMessage(true);

    try {
      let response = await fetch('/pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        // Read the error body to provide a meaningful message
        let errorText = await response.text();
        throw new Error(errorText);
      }

      let data = await response.json();
      let { images } = data;
      this.uploadedPdfs = images;
      this.store.pushPayload({ images });
      return images;
    } catch (err) {
      this.setShowLoadingMessage(false);
      this.errorHandling.handleErrors(err, 'uploadErrors', err);
    }
  }

  setShowLoadingMessage(shouldShow) {
    if (shouldShow) {
      // Schedule a delayed toggle to show the message after 500 ms
      this.loadingMessageTimer = later(
        this,
        () => {
          this.showLoadingMessage = true;
        },
        500
      );
    } else {
      // Hide immediately and cancel any pending timer
      this.showLoadingMessage = false;
      if (this.loadingMessageTimer) {
        this.loadingMessageTimer.cancel();
        this.loadingMessageTimer = null;
      }
    }
  }

  get totalPdfSize() {
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
  }

  get totalImageSize() {
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
  }

  get isOverPdfLimit() {
    return this.totalPdfSize > this.totalPdfSizeLimit;
  }

  get isOverImageLimit() {
    return this.totalImageSize > this.totalImageSizeLimit;
  }

  resetFileInput() {
    if (this._fileInputEl) {
      this.filesToBeUploaded = null;
      this._fileInputEl.value = ''; // Clear the real DOM input
    }
  }

  @action
  storeFileInputEl(el) {
    this._fileInputEl = el;
  }

  @action
  resetMissingFilesError() {
    this.missingFilesError = false;
  }

  @action
  resetOverSizedFileError() {
    this.overSizedFileError = null;
  }

  @action
  uploadImages() {
    const uploadData = this.filesToBeUploaded;
    if (!uploadData) {
      this.setShowLoadingMessage(false);
      this.missingFilesError = true;
      return;
    }
    if (this.isOverPdfLimit || this.isOverImageLimit) {
      this.setShowLoadingMessage(false);
      this.isOverSizeLimit = true;
      return;
    }
    this.setShowLoadingMessage(true);

    let formData = new FormData();
    let pdfFormData = new FormData();

    let imageCount = 0;
    let pdfCount = 0;

    for (let f of uploadData) {
      let fileSize = f.size;
      if (fileSize > this.singleFileSizeLimit) {
        this.setShowLoadingMessage(false);
        this.overSizedFileError = this.getOverSizedFileMsg(f.size, f.name);
        this.filesToBeUploaded = null;
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
      return this.uploadImage(formData).then(() => {
        if (pdfCount > 0) {
          return this.uploadPdf(pdfFormData).then(() => {
            let results;
            if (this.uploadedPdfs && this.uploadedImages) {
              results = this.uploadedPdfs.concat(this.uploadedImages);
              this.setShowLoadingMessage(false);
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
              this.uploadResults = results;
              if (this.doResetFilesAfterUpload) {
                this.resetFileInput();
              }
            }
          });
        } else {
          this.setShowLoadingMessage(false);

          let images = this.uploadedImages;
          let fileModifier = images.length === 1 ? 'file' : 'files';

          let msg = `Uploaded ${images.length} ${fileModifier} successfully`;
          this.alert.showToast('success', msg, 'bottom-end', 3000, false, null);
          if (this.handleUploadResults) {
            this.handleUploadResults(images);
          }
          this.uploadResults = this.uploadedImages;
          if (this.doResetFilesAfterUpload) {
            this.resetFileInput();
          }
        }
      });
    } else if (pdfCount > 0) {
      return this.uploadPdf(pdfFormData).then(() => {
        this.setShowLoadingMessage(false);

        let pdfs = this.uploadedPdfs;

        let fileModifier = pdfs.length === 1 ? 'file' : 'files';

        let msg = `Uploaded ${pdfs.length} ${fileModifier} successfully`;
        this.alert.showToast('success', msg, 'bottom-end', 3000, false, null);
        if (this.handleUploadResults) {
          this.handleUploadResults(pdfs);
        }
        this.uploadResults = this.uploadedPdfs;
        if (this.doResetFilesAfterUpload) {
          this.resetFileInput();
        }
      });
    }
  }

  @action
  updateFiles(event) {
    if (this.missingFilesError) {
      this.missingFilesError = false;
    }

    this.filesToBeUploaded = event.target.form.firstElementChild.files;
    if (this.storeFiles) {
      this.storeFiles(event.target.form.firstElementChild.files);
    }
  }
}

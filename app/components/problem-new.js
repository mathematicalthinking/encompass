import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import _isNull from 'lodash/isNull';

export default class ProblemNewComponent extends Component {
  @service('sweet-alert') alert;
  @service errorHandling;
  @service store;
  @service router;
  @service currentUser;
  @tracked showGeneral = true;
  @tracked filesToBeUploaded = null;
  @tracked isMissingRequiredFields = null;
  @tracked isPublic = null;
  @tracked privacySetting = null;
  @tracked checked = true;
  @tracked status = null;
  @tracked problemStatement = '';
  @tracked quillText = null;
  @tracked isQuillEmpty = null;
  @tracked isQuillTooLong = null;
  @tracked showCats = false;
  @tracked showGeneral = true;
  @tracked showAdditional = false;
  @tracked showLegal = false;
  @tracked approvedProblem = false;
  @tracked noLegalNotice = null;
  @tracked showCategories = false;
  @tracked keywords = [];
  @tracked uploadResults = null;
  @tracked additionalImage = null;
  @tracked fileName = null;
  tooltips = {
    name: 'Please try and give all your problems a unique title',
    statement: 'Content of the problem to be completed',
    categories:
      'Use category menu to select appropriate common core categories',
    keywords: 'Add keywords to help other people find this problem',
    additionalInfo: 'Any additional information desired for the problem',
    additionalImage:
      'You can upload a JPG, PNG or PDF (only the first page is saved)',
    privacySettings:
      'Just Me makes your problem private, My Organization allows your problem to be seen by all members in your organization, and Public means every user can see your problem',
    copyrightNotice: 'Add notice if problem contains copyrighted material',
    sharingAuth:
      'If you are posting copyrighted material please note your permission',
    author: 'Name of the person who wrote this problem, (is the author)',
    legalNotice:
      'Please verify that the material you are posting is either your own or properly authorized to share',
  };
  @tracked selectedCategories = [];

  get createProblemErrors() {
    return this.errorHandling.getErrors('createProblemErrors') || [];
  }

  get imageUploadErrors() {
    return this.errorHandling.getErrors('imageUploadErrors') || [];
  }

  constructor() {
    super(...arguments);
    // if the outlet exists (where this component appears in the parent), show it
    document.getElementById('outlet')?.classList.remove('hidden');
  }

  @action observeErrors() {
    let missingError = this.isMissingRequiredFields;
    if (!missingError) {
      return;
    }
    let title = this.title;
    let privacySetting = this.privacySetting;
    if (!!title && !!privacySetting) {
      this.isMissingRequiredFields = false;
    }
  }

  // Empty quill editor .html() property returns <p><br></p>
  // For quill to not be empty, there must either be some text or a student
  // must have uploaded an img so there must be an img tag
  isQuillValid() {
    return !this.isQuillEmpty && !this.isQuillTooLong;
  }

  createProblem() {
    const problemStatement = this.problemStatement;
    const currentUser = this.currentUser.user;
    let createdBy = currentUser;
    let title = this.problemTitle.trim();
    let additionalInfo = this.additionalInfo;
    let privacySetting = this.privacySetting;
    let accountType = currentUser.accountType;
    let organization = currentUser.organization;
    let categories = this.selectedCategories;
    let copyrightNotice = this.copyrightNotice;
    let sharingAuth = this.sharingAuth;
    let additionalImage = this.additionalImage;
    let author = this.author;
    let keywords = this.keywords;

    if (!this.approvedProblem) {
      this.noLegalNotice = true;
      return;
    }

    if (accountType === 'A') {
      this.status = 'approved';
    } else if (accountType === 'P') {
      if (privacySetting === 'E') {
        this.status = 'pending';
      } else {
        this.status = 'approved';
      }
    } else {
      if (privacySetting === 'M') {
        this.status = 'approved';
      } else {
        this.status = 'pending';
      }
    }
    let status = this.status;

    let createProblemData = this.store.createRecord('problem', {
      createdBy: createdBy,
      createDate: new Date(),
      title: title,
      text: problemStatement,
      categories: categories,
      additionalInfo: additionalInfo,
      privacySetting: privacySetting,
      organization: organization,
      status: status,
      copyrightNotice: copyrightNotice,
      sharingAuth: sharingAuth,
      author: author,
      keywords: keywords,
    });

    if (additionalImage) {
      let uploadData = additionalImage;
      let formData = new FormData();
      for (let f of uploadData) {
        formData.append('photo', f);
      }
      formData.append('createdBy', createdBy);
      let firstItem = uploadData[0];
      let isPDF = firstItem.type === 'application/pdf';

      if (isPDF) {
        fetch('/pdf', {
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
            this.uploadResults = res.images;
            this.store.findRecord('image', res.images[0]._id).then((image) => {
              createProblemData.set('image', image);
              createProblemData
                .save()
                .then((problem) => {
                  this.alert.showToast(
                    'success',
                    'Problem Created',
                    'bottom-end',
                    4000,
                    false,
                    null
                  );
                  // let parentView = this.parentView;
                  // this.get('parentActions.refreshList').call(parentView);
                  this.router.transitionTo('problems.problem', problem.id);
                })
                .catch((err) => {
                  if (
                    err.errors[0].detail ===
                    `There is already an existing public problem titled "${title}."`
                  ) {
                    this.toggleGeneral();
                  }
                  this.errorHandling.handleErrors(
                    err,
                    'createProblemErrors',
                    createProblemData
                  );
                });
            });
          })
          .catch(function (err) {
            this.errorHandling.handleErrors(err, 'imageUploadErrors');
          });
      } else {
        fetch('/image', {
          method: 'POST',
          body: formData,
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then(function (res) {
            this.uploadResults = res.images;
            this.store.findRecord('image', res.images[0]._id).then((image) => {
              createProblemData.set('image', image);
              createProblemData
                .save()
                .then((problem) => {
                  this.alert.showToast(
                    'success',
                    'Problem Created',
                    'bottom-end',
                    4000,
                    false,
                    null
                  );
                  this.router.transitionTo('problems.problem', problem.id);
                })
                .catch((err) => {
                  if (
                    err.errors[0].detail ===
                    `There is already an existing public problem titled "${title}."`
                  ) {
                    this.toggleGeneral();
                  }
                  this.errorHandling.handleErrors(
                    err,
                    'createProblemErrors',
                    createProblemData
                  );
                });
            });
          })
          .catch(function (err) {
            this.errorHandling.handleErrors(err, 'imageUploadErrors');
          });
      }
    } else {
      createProblemData
        .save()
        .then((res) => {
          this.alert.showToast(
            'success',
            'Problem Created',
            'bottom-end',
            4000,
            false,
            null
          );
          // let parentView = this.parentView;
          // this.get('parentActions.refreshList').call(parentView);
          this.router.transitionTo('problems.problem', res.id);
        })
        .catch((err) => {
          if (
            err.errors[0].detail ===
            `There is already an existing public problem titled "${title}."`
          ) {
            this.toggleGeneral();
          }
          this.errorHandling.handleErrors(
            err,
            'createProblemErrors',
            createProblemData
          );
        });
    }
  }

  keywordFilter(keyword) {
    if (!keyword) {
      // No keyword was entered
      return false;
    }

    // Grab the element without jQuery
    const selectEl = document.getElementById('select-add-keywords');
    if (!selectEl || !selectEl.selectize) {
      // If the element or Selectize isn't set up, allow keyword creation by default
      return true;
    }

    // Get the current list of items (strings/IDs)
    const items = selectEl.selectize.items;
    // Convert the new keyword and existing items to lowercase
    const keywordLower = keyword.trim().toLowerCase();
    const itemsLower = items.map((item) => item.toLowerCase());

    // Don't let the user create the keyword if it matches an existing one exactly
    return !itemsLower.includes(keywordLower);
  }

  @action radioSelect(value) {
    this.privacySetting = value;
  }

  @action validate() {
    if (!this.approvedProblem) {
      this.noLegalNotice = true;
      return;
    }
    if (this.isMissingRequiredFields) {
      this.isMissingRequiredFields = null;
    } else {
      this.createProblem();
    }
  }

  @action problemCreate() {
    this.createProblem();
  }

  @action toggleCategories() {
    this.showCategories = !this.showCategories;
  }

  @action addCategory(category) {
    let categories = this.selectedCategories;
    if (!categories.includes(category)) {
      categories.pushObject(category);
    }
  }

  @action removeCategory(category) {
    let categories = this.selectedCategories;
    categories.removeObject(category);
  }

  @action
  cancelProblem() {
    document.getElementById('outlet')?.classList.add('hidden');
    this.router.transitionTo('problems');
  }

  @action setFileToUpload(file) {
    this.additionalImage = file;
    this.fileName = file[0].name;
  }

  @action resetErrors() {
    const errors = [
      'noLegalNotice',
      'createProblemErrors',
      'imageUploadErrors',
    ];

    this.errorHandling.removeMessages(...errors);
  }

  @action
  hideInfo() {
    document.getElementById('outlet')?.classList.add('hidden');
    this.router.transitionTo('problems');
  }

  @action confirmCreatePublic() {
    this.alert
      .showModal(
        'question',
        'Are you sure you want to create a public problem?',
        'Creating a public problem means it will be accessible to all EnCoMPASS users. You will not be able to make any changes once this problem has been used',
        'Yes'
      )
      .then((result) => {
        if (result.value) {
          this.showCats = true;
          this.showGeneral = false;
          this.showAdditional = false;
          this.showLegal = false;
        }
      });
  }

  @action toggleGeneral() {
    this.showGeneral = true;
    this.showCats = false;
    this.showAdditional = false;
    this.showLegal = false;
  }

  @action
  toggleCats() {
    // clear existing errors before validating
    this.errorHandling.removeMessages('createProblemErrors');

    if (this.showAdditional) {
      this.showCats = true;
      this.showGeneral = false;
      this.showAdditional = false;
      this.showLegal = false;
    } else {
      this.problemTitle = this.title;
      const quillContent =
        document.querySelector('.ql-editor')?.innerHTML || '';
      const problemStatement = quillContent.replace(/["]/g, "'");
      this.problemStatement = problemStatement;

      const isQuillValid = this.isQuillValid();
      if (
        !isQuillValid ||
        !this.problemTitle ||
        !this.problemStatement ||
        !this.privacySetting
      ) {
        this.isMissingRequiredFields = true;
        return;
      }
      if (this.privacySetting === 'E') {
        this.confirmCreatePublic();
      } else {
        this.showCats = true;
        this.showGeneral = false;
        this.showAdditional = false;
        this.showLegal = false;
      }
    }
  }

  @action toggleAdditional() {
    this.showAdditional = true;
    this.showCats = false;
    this.showGeneral = false;
    this.showLegal = false;
  }

  @action toggleLegal() {
    this.showLegal = true;
    this.showCats = false;
    this.showAdditional = false;
    this.showGeneral = false;
  }

  @action nextStep() {
    console.log('next step!');
    if (this.showGeneral) {
      this.toggleCats();
    } else if (this.showCats) {
      this.toggleAdditional();
    } else if (this.showAdditional) {
      this.toggleLegal();
    }
  }

  @action backStep() {
    if (this.showCats) {
      this.toggleGeneral();
    } else if (this.showAdditional) {
      this.toggleCats();
    } else if (this.showLegal) {
      this.toggleAdditional();
    }
  }

  @action updateKeywords(val, $item) {
    if (!val) {
      return;
    }
    let keywords = this.keywords;

    let isRemoval = _isNull($item);

    if (isRemoval) {
      keywords.removeObject(val);
      return;
    }
    keywords.addObject(val);
  }
  @action updateQuillText(content, isEmpty, isOverLengthLimit) {
    this.quillText = content;
    this.isQuillEmpty = isEmpty;
    this.isQuillTooLong = isOverLengthLimit;
  }
}

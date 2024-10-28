import ErrorHandlingComponent from './error-handling';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import _ from 'underscore';
import $ from 'jquery';

export default class ProblemNewComponent extends ErrorHandlingComponent {
  @service('sweet-alert') alert;
  @service store;
  @service router;
  @tracked showGeneral = true;
  @tracked filesToBeUploaded = null;
  @tracked createProblemErrors = [];
  @tracked imageUploadErrors = [];
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
  // parentActions: alias('parentView.actions'),
  @tracked approvedProblem = false;
  @tracked noLegalNotice = null;
  @tracked showCategories = false;
  @tracked keywords = [];
  @tracked uploadResults = null;
  @tracked additionalImage = null;
  @tracked fileName = null;
  @tracked categoryTree = {};
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

  constructor() {
    super(...arguments);
    $('.list-outlet').removeClass('hidden');
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
    let createdBy = this.args.currentUser;
    let title = this.problemTitle.trim();
    let additionalInfo = this.additionalInfo;
    let privacySetting = this.privacySetting;
    let currentUser = this.args.currentUser;
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
      let firstItem = uploadData[0];
      let isPDF = firstItem.type === 'application/pdf';

      if (isPDF) {
        $.post({
          url: '/pdf',
          processData: false,
          contentType: false,
          data: formData,
          createdBy: createdBy,
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
                  this.handleErrors(
                    err,
                    'createProblemErrors',
                    createProblemData
                  );
                });
            });
          })
          .catch(function (err) {
            this.handleErrors(err, 'imageUploadErrors');
          });
      } else {
        $.post({
          url: '/image',
          processData: false,
          contentType: false,
          data: formData,
          createdBy: createdBy,
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
                  this.handleErrors(
                    err,
                    'createProblemErrors',
                    createProblemData
                  );
                });
            });
          })
          .catch(function (err) {
            this.handleErrors(err, 'imageUploadErrors');
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
          this.handleErrors(err, 'createProblemErrors', createProblemData);
        });
    }
  }

  keywordFilter(keyword) {
    if (!keyword) {
      return;
    }
    let keywords = $('#select-add-keywords')[0].selectize.items;

    let keywordLower = keyword.trim().toLowerCase();

    let keywordsLower = _.map(keywords, (key) => {
      return key.toLowerCase();
    });
    // don't let user create keyword if it matches exactly an existing keyword
    return !_.contains(keywordsLower, keywordLower);
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
    this.store.query('category', {}).then((queryCats) => {
      let categories = queryCats.get('meta');
      this.categoryTree = categories.categories;
    });
    this.showCategories = !this.showCategories;
  }

  @action addCategories(category) {
    let categories = this.selectedCategories;
    if (!categories.includes(category)) {
      categories.pushObject(category);
    }
  }

  @action removeCategory(category) {
    let categories = this.selectedCategories;
    categories.removeObject(category);
  }

  @action cancelProblem() {
    $('.list-outlet').addClass('hidden');
    this.router.transitionTo('problems');
  }

  @action setFileToUpload(file) {
    this.additionalImage = file;
    this.fileName = file[0].name;
  }

  // @action removeFile() {
  //   this.additionalImage = null;
  //   this.fileName = null;
  // }

  @action resetErrors() {
    const errors = [
      'noLegalNotice',
      'createProblemErrors',
      'imageUploadErrors',
    ];

    for (let error of errors) {
      if (this[error]) {
        this[error] = null;
      }
    }
  }

  @action hideInfo() {
    $('.list-outlet').addClass('hidden');
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
    // this.set('privacySetting', this.privacySetting);
    this.showGeneral = true;
    this.showCats = false;
    this.showAdditional = false;
    this.showLegal = false;
  }

  @action toggleCats() {
    // clear existing errors before validating
    if (this.createProblemErrors) {
      this.createProblemErrors = [];
    }

    if (this.showAdditional) {
      this.showCats = true;
      this.showGeneral = false;
      this.showAdditional = false;
      this.showLegal = false;
    } else {
      this.problemTitle = this.title;
      let quillContent = $('.ql-editor').html();
      let problemStatement = quillContent.replace(/["]/g, "'");
      this.problemStatement = problemStatement;
      // this.set('privacySetting', this.privacySetting);

      let isQuillValid = this.isQuillValid();
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

    let isRemoval = _.isNull($item);

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

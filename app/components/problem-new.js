/*global _:false */
import Component from '@ember/component';
import { observer } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import $ from 'jquery';
import ErrorHandlingMixin from '../mixins/error_handling_mixin';

export default Component.extend(ErrorHandlingMixin, {
  tagName: '',
  elementId: 'problem-new',
  classNames: ['side-info'],
  showGeneral: true,
  filesToBeUploaded: null,
  createProblemErrors: () => [],
  imageUploadErrors: () => [],
  isMissingRequiredFields: null,
  isPublic: null,
  privacySetting: null,
  checked: true,
  status: null,
  alert: service('sweet-alert'),
  parentActions: alias('parentView.actions'),
  approvedProblem: false,
  noLegalNotice: null,
  showCategories: false,
  keywords: () => [],

  init: function () {
    this._super(...arguments);
    let tooltips = {
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
    this.set('tooltips', tooltips);
    this.set('selectedCategories', []);
    this.set('keywordFilter', this.createKeywordFilter.bind(this));
  },

  didInsertElement: () => {
    $('.list-outlet').removeClass('hidden');
  },

  willDestroyElement() {
    $('.list-outlet').addClass('hidden');
    this._super(...arguments);
  },

  observeErrors: observer('title', 'privacySetting', function () {
    let missingError = this.isMissingRequiredFields;
    if (!missingError) {
      return;
    }
    let title = this.title;
    let privacySetting = this.privacySetting;
    if (!!title && !!privacySetting) {
      this.set('isMissingRequiredFields', false);
    }
  }),

  // Empty quill editor .html() property returns <p><br></p>
  // For quill to not be empty, there must either be some text or a student
  // must have uploaded an img so there must be an img tag
  isQuillValid: function () {
    return !this.isQuillEmpty && !this.isQuillTooLong;
  },

  createProblem: function () {
    let that = this;
    const problemStatement = this.problemStatement;
    let createdBy = that.get('currentUser');
    let title = that.get('problemTitle').trim();
    let additionalInfo = that.get('additionalInfo');
    let privacySetting = that.get('privacySetting');
    let currentUser = that.get('currentUser');
    let accountType = currentUser.get('accountType');
    let organization = currentUser.get('organization');
    let categories = this.selectedCategories;
    let copyrightNotice = that.get('copyrightNotice');
    let sharingAuth = that.get('sharingAuth');
    let additionalImage = that.get('additionalImage');
    let author = that.get('author');
    let keywords = that.get('keywords');

    if (!this.approvedProblem) {
      this.set('noLegalNotice', true);
      return;
    }

    if (accountType === 'A') {
      this.set('status', 'approved');
    } else if (accountType === 'P') {
      if (privacySetting === 'E') {
        this.set('status', 'pending');
      } else {
        this.set('status', 'approved');
      }
    } else {
      if (privacySetting === 'M') {
        this.set('status', 'approved');
      } else {
        this.set('status', 'pending');
      }
    }
    let status = this.status;

    let createProblemData = that.store.createRecord('problem', {
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
            that.set('uploadResults', res.images);
            that.store.findRecord('image', res.images[0]._id).then((image) => {
              createProblemData.set('image', image);
              createProblemData
                .save()
                .then((problem) => {
                  that
                    .get('alert')
                    .showToast(
                      'success',
                      'Problem Created',
                      'bottom-end',
                      4000,
                      false,
                      null
                    );
                  let parentView = this.parentView;
                  this.parentActions.refreshList.call(parentView);
                  that.sendAction('toProblemInfo', problem);
                })
                .catch((err) => {
                  if (
                    err.errors[0].detail ===
                    `There is already an existing public problem titled "${title}."`
                  ) {
                    this.send('showGeneral');
                  }
                  that.handleErrors(
                    err,
                    'createProblemErrors',
                    createProblemData
                  );
                });
            });
          })
          .catch(function (err) {
            that.handleErrors(err, 'imageUploadErrors');
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
            that.set('uploadResults', res.images);
            that.store.findRecord('image', res.images[0]._id).then((image) => {
              createProblemData.set('image', image);
              createProblemData
                .save()
                .then((problem) => {
                  that
                    .get('alert')
                    .showToast(
                      'success',
                      'Problem Created',
                      'bottom-end',
                      4000,
                      false,
                      null
                    );
                  let parentView = this.parentView;
                  this.parentActions.refreshList.call(parentView);
                  that.sendAction('toProblemInfo', problem);
                })
                .catch((err) => {
                  if (
                    err.errors[0].detail ===
                    `There is already an existing public problem titled "${title}."`
                  ) {
                    this.send('showGeneral');
                  }
                  that.handleErrors(
                    err,
                    'createProblemErrors',
                    createProblemData
                  );
                });
            });
          })
          .catch(function (err) {
            that.handleErrors(err, 'imageUploadErrors');
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
          let parentView = this.parentView;
          this.parentActions.refreshList.call(parentView);
          that.sendAction('toProblemInfo', res);
        })
        .catch((err) => {
          if (
            err.errors[0].detail ===
            `There is already an existing public problem titled "${title}."`
          ) {
            this.send('showGeneral');
          }
          that.handleErrors(err, 'createProblemErrors', createProblemData);
        });
    }
  },

  createKeywordFilter(keyword) {
    if (!keyword) {
      return;
    }
    let keywords = this.$('#select-add-keywords')[0].selectize.items;

    let keywordLower = keyword.trim().toLowerCase();

    let keywordsLower = _.map(keywords, (key, val) => {
      return key.toLowerCase();
    });
    // don't let user create keyword if it matches exactly an existing keyword
    return !_.contains(keywordsLower, keywordLower);
  },

  actions: {
    radioSelect: function (value) {
      this.set('privacySetting', value);
    },

    validate: function () {
      if (!this.approvedProblem) {
        this.set('noLegalNotice', true);
        return;
      }
      if (this.isMissingRequiredFields) {
        this.set('isMissingRequiredFields', null);
      } else {
        this.createProblem();
      }
    },

    problemCreate: function () {
      this.createProblem();
    },

    showCategories: function () {
      this.store.query('category', {}).then((queryCats) => {
        let categories = queryCats.get('meta');
        this.set('categoryTree', categories.categories);
      });
      this.set('showCategories', !this.showCategories);
    },

    addCategories: function (category) {
      let categories = this.selectedCategories;
      if (!categories.includes(category)) {
        categories.pushObject(category);
      }
    },

    removeCategory: function (category) {
      let categories = this.selectedCategories;
      categories.removeObject(category);
    },

    cancelProblem: function () {
      $('.list-outlet').addClass('hidden');
      this.sendAction('toProblemList');
    },

    setFileToUpload: function (file) {
      this.set('additionalImage', file);
      this.set('fileName', file[0].name);
    },

    removeFile: function () {
      this.set('additionalImage', null);
      this.set('fileName', null);
    },

    resetErrors(e) {
      const errors = [
        'noLegalNotice',
        'createProblemErrors',
        'imageUploadErrors',
      ];

      for (let error of errors) {
        if (this.get(error)) {
          this.set(error, null);
        }
      }
    },

    hideInfo: function () {
      $('.list-outlet').addClass('hidden');
      this.sendAction('toProblemList');
    },

    confirmCreatePublic: function () {
      this.alert
        .showModal(
          'question',
          'Are you sure you want to create a public problem?',
          'Creating a public problem means it will be accessible to all EnCoMPASS users. You will not be able to make any changes once this problem has been used',
          'Yes'
        )
        .then((result) => {
          if (result.value) {
            this.set('showCats', true);
            this.set('showGeneral', false);
            this.set('showAdditional', false);
            this.set('showLegal', false);
          }
        });
    },

    showGeneral: function () {
      this.set('privacySetting', this.privacySetting);
      this.set('showGeneral', true);
      this.set('showCats', false);
      this.set('showAdditional', false);
      this.set('showLegal', false);
    },

    showCats: function () {
      // clear existing errors before validating
      if (this.createProblemErrors) {
        this.set('createProblemErrors', []);
      }

      if (this.showAdditional) {
        this.set('showCats', true);
        this.set('showGeneral', false);
        this.set('showAdditional', false);
        this.set('showLegal', false);
      } else {
        this.set('problemTitle', this.title);
        let quillContent = this.$('.ql-editor').html();
        let problemStatement = quillContent.replace(/["]/g, "'");
        this.set('problemStatement', problemStatement);
        this.set('privacySetting', this.privacySetting);

        let isQuillValid = this.isQuillValid();
        if (
          !isQuillValid ||
          !this.problemTitle ||
          !this.problemStatement ||
          !this.privacySetting
        ) {
          this.set('isMissingRequiredFields', true);
          return;
        }
        if (this.privacySetting === 'E') {
          this.send('confirmCreatePublic');
        } else {
          this.set('showCats', true);
          this.set('showGeneral', false);
          this.set('showAdditional', false);
          this.set('showLegal', false);
        }
      }
    },

    showAdditional: function () {
      this.set('showAdditional', true);
      this.set('showCats', false);
      this.set('showGeneral', false);
      this.set('showLegal', false);
    },

    showLegal: function () {
      this.set('showLegal', true);
      this.set('showCats', false);
      this.set('showAdditional', false);
      this.set('showGeneral', false);
    },

    nextStep: function () {
      console.log('next step!');
      if (this.showGeneral) {
        this.send('showCats');
      } else if (this.showCats) {
        this.send('showAdditional');
      } else if (this.showAdditional) {
        this.send('showLegal');
      }
    },

    backStep: function () {
      if (this.showCats) {
        this.send('showGeneral');
      } else if (this.showAdditional) {
        this.send('showCats');
      } else if (this.showLegal) {
        this.send('showAdditional');
      }
    },

    updateKeywords(val, $item) {
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
    },
    updateQuillText(content, isEmpty, isOverLengthLimit) {
      this.set('quillText', content);
      this.set('isQuillEmpty', isEmpty);
      this.set('isQuillTooLong', isOverLengthLimit);
    },
  },
});

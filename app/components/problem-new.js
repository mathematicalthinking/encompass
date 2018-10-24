Encompass.ProblemNewComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {
  elementId: 'problem-new',
  classNames: ['side-info'],
  showGeneral: true,
  filesToBeUploaded: null,
  createProblemErrors: [],
  imageUploadErrors: [],
  isMissingRequiredFields: null,
  isPublic: null,
  privacySetting: null,
  checked: true,
  validator: Ember.inject.service('form-validator'),
  alert: Ember.inject.service('sweet-alert'),
  approvedProblem: false,
  noLegalNotice: null,
  showCategories: false,

  init: function () {
    this._super(...arguments);
    let tooltips = {
        name: 'Please try and give all your problems a unique name',
        statement: 'Content of the problem to be completed',
        categories: 'Use category menu to select appropriate common core categories',
        keywords: 'Add keywords to help other people find this problem',
        additionalInfo: 'Any additional information desired for the problem',
        additionalImage: 'You can upload a JPG, PNG or PDF (only the first page is saved)',
        privacySettings: 'Just Me makes your problem private, My Organization allows your problem to be seen by all members in your organization, and public means every user can see your problem',
        copyrightNotice: 'Add notice if problem contains copyrighted material',
        sharingAuth: 'If you are posting copyrighted material please note your permission',
        legalNotice: 'Please verify that the material you are posting is either your own or properly authorized to share',
      };
    this.set('tooltips', tooltips);
    this.set('selectedCategories', []);
  },

  didInsertElement: function() {
    let formId = 'form#newproblemform';
    this.set('formId', formId);

    let isMissing = this.checkMissing.bind(this);
    this.get('validator').initialize(formId, isMissing);

    var options = {
      debug: 'false',
      modules: {
        toolbar: [
        ['bold', 'italic', 'underline'],
        ['image'],
        ]
      },
      placeholder: 'Problem Statement',
      theme: 'snow'
    };
    var quill = new window.Quill('#editor', options); // eslint-disable-line no-unused-vars
  },

  checkMissing: function() {
    const id = this.get('formId');
    let isMissing = this.get('validator').isMissingRequiredFields(id);
    this.set('isMissingRequiredFields', isMissing);
  },

  observeErrors: function() {
    let missingError = this.get('isMissingRequiredFields');
    if (!missingError) {
      return;
    }
    let title = this.get('title');
    let privacySetting = this.get('privacySetting');
    if (!!title && !!privacySetting) {
      this.set('isMissingRequiredFields', false);
    }
  }.observes('title', 'privacySetting'),

  // Empty quill editor .html() property returns <p><br></p>
  // For quill to not be empty, there must either be some text or a student
  // must have uploaded an img so there must be an img tag
  isQuillValid: function() {
    let pText = this.$('.ql-editor p').text();
    if (pText.length > 0) {
      return true;
    }
    let content = this.$('.ql-editor').html();
    if (content.includes('<img')) {
      return true;
    }
    return false;
  },

  createProblem: function() {
    var that = this;
    const quillContent = this.$('.ql-editor').html();
    const problemStatement = quillContent.replace(/["]/g, "'");
    var createdBy = that.get('currentUser');
    var title = that.get('title');
    //var categories = [];
    var additionalInfo = that.get('additionalInfo');
    var privacySetting = that.get('privacySetting');
    var currentUser = that.get('currentUser');
    var organization = currentUser.get('organization');
    var categories = this.get('selectedCategories');
    var copyrightNotice = that.get('copyrightNotice');
    var sharingAuth = that.get('sharingAuth');

    if (!this.get('approvedProblem')) {
      this.set('noLegalNotice', true);
      return;
    }

    var createProblemData = that.store.createRecord('problem', {
      createdBy: createdBy,
      createDate: new Date(),
      title: title,
      text: problemStatement,
      categories: categories,
      additionalInfo: additionalInfo,
      privacySetting: privacySetting,
      organization: organization,
      copyrightNotice: copyrightNotice,
      sharingAuth: sharingAuth
    });

    if (that.filesToBeUploaded) {
      var uploadData = that.get('filesToBeUploaded');
      var formData = new FormData();
      for(let f of uploadData) {
        formData.append('photo', f);
      }
      let firstItem = uploadData[0];
      let isPDF = firstItem.type === 'application/pdf';

      if (isPDF) {
        Ember.$.post({
          url: '/pdf',
          processData: false,
          contentType: false,
          data: formData,
          createdBy: createdBy
        }).then(function (res) {
          that.set('uploadResults', res.images);
          that.store.findRecord('image', res.images[0]._id).then((image) => {
            createProblemData.set('image', image);
            createProblemData.save()
              .then((problem) => {
                this.get('alert').showToast('success', 'Problem Created', 'bottom-end', 4000, false, null);
                that.sendAction('toProblemInfo', problem);
              })
              .catch((err) => {
                that.handleErrors(err, 'createProblemErrors', createProblemData);
              });
          });
        }).catch(function (err) {
          that.handleErrors(err, 'imageUploadErrors');
        });
      } else {
        Ember.$.post({
          url: '/image',
          processData: false,
          contentType: false,
          data: formData,
          createdBy: createdBy
        }).then(function (res) {
          that.set('uploadResults', res.images);
          that.store.findRecord('image', res.images[0]._id).then((image) => {
            createProblemData.set('image', image);
            createProblemData.save()
              .then((problem) => {
                this.get('alert').showToast('success', 'Problem Created', 'bottom-end', 4000, false, null);
                that.sendAction('toProblemInfo', problem);
              })
              .catch((err) => {
                that.handleErrors(err, 'createProblemErrors', createProblemData);
              });
          });
        }).catch(function (err) {
          that.handleErrors(err, 'imageUploadErrors');
        });
      }
    } else {
      createProblemData.save()
        .then((res) => {
          this.get('alert').showToast('success', 'Problem Created', 'bottom-end', 4000, false, null);
          that.sendAction('toProblemInfo', res);
        })
        .catch((err) => {
          that.handleErrors(err, 'createProblemErrors', createProblemData);
        });
      }
    },

  confirmCreatePublic: function() {
    this.get('alert').showModal('question', 'Are you sure you want to create a public problem?', 'Creating a public problem means it will be accessible to all EnCoMPASS users. You will not be able to make any changes once this problem has been used', 'Yes')
    .then((result) => {
      if (result.value) {
        this.createProblem();
      }
    });
  },

  actions: {
    radioSelect: function(value) {
      this.set('privacySetting', value);
    },

    validate: function() {
      let title = this.get('title');
      let privacySetting = this.get('privacySetting');

      let isQuillValid = this.isQuillValid();
      if (!isQuillValid || !title || !privacySetting) {
        this.set('isMissingRequiredFields', true);
        return;
      }

      if (!this.get('approvedProblem')) {
        this.set('noLegalNotice', true);
        return;
      }
      if (this.get('isMissingRequiredFields')) {
        this.set('isMissingRequiredFields', null);
      }
      if (privacySetting === "E") {
        this.confirmCreatePublic();
      } else {
        this.createProblem();
      }
    },

    problemCreate: function() {
      this.createProblem();
    },

    showCategories: function() {
      this.get('store').query('category', {}).then((queryCats) => {
        let categories = queryCats.get('meta');
        this.set('categoryTree', categories.categories);
      });
      this.set('showCategories', !(this.get('showCategories')));
    },

    addCategories: function(category) {
      let categories = this.get('selectedCategories');
      if (!categories.includes(category)) {
        categories.pushObject(category);
      }
    },

    removeCategory: function(category) {
      let categories = this.get('selectedCategories');
      categories.removeObject(category);
    },

    cancelProblem: function() {
      $('.list-outlet').addClass('hidden');
    },

    resetErrors(e) {
      const errors = ['noLegalNotice', 'createProblemErrors', 'imageUploadErrors'];

      for (let error of errors) {
        if (this.get(error)) {
          this.set(error, null);
        }
      }
    },

    hideInfo: function () {
      $('.list-outlet').addClass('hidden');
    },

    showGeneral: function () {
      this.set('showGeneral', true);
      this.set('showCats', false);
      this.set('showAdditional', false);
      this.set('showLegal', false);
    },

    showCats: function () {
      this.set('showCats', true);
      this.set('showGeneral', false);
      this.set('showAdditional', false);
      this.set('showLegal', false);
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
  }
});


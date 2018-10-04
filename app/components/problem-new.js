Encompass.ProblemNewComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {
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
    var quill = new window.Quill('#editor', options);
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

    var createProblemData = that.store.createRecord('problem', {
      createdBy: createdBy,
      createDate: new Date(),
      title: title,
      text: problemStatement,
      // categories: categories,
      additionalInfo: additionalInfo,
      privacySetting: privacySetting,
      organization: organization,
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
    radioSelect: function (value) {
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
      this.set('showCategories', !(this.get('showCategories')));
    },

    resetErrors(e) {
      const errors = ['noLegalNotice', 'createProblemErrors', 'imageUploadErrors'];

      for (let error of errors) {
        if (this.get(error)) {
          this.set(error, null);
        }
      }
    },
  }
});


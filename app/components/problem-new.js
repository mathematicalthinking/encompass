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

  createProblem: function() {
    var that = this;
    var createdBy = that.get('currentUser');
    var title = that.get('title');
    const quillContent = this.$('.ql-editor').html();
    const text = quillContent.replace(/["]/g, "'");
    //var categories = [];
    var additionalInfo = that.get('additionalInfo');
    var privacySetting = that.get('privacySetting');
    var currentUser = that.get('currentUser');
    var organization = currentUser.get('organization');

    if (!this.get('approvedProblem')) {
      this.set('noLegalNotice', true);
      return;
    }

    var createProblemData = that.store.createRecord('problem', {
      createdBy: createdBy,
      createDate: new Date(),
      title: title,
      text: text,
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
      var that = this;
      return this.get('validator').validate(that.get('formId'))
      .then((res) => {
        if (res.isValid) {
          // proceed with problem creation
          var privacySetting = that.get('privacySetting');
          if (privacySetting === "E") {
            this.confirmCreatePublic();
          } else {
            this.createProblem();
          }
        } else {
          if (res.invalidInputs) {
            this.set('isMissingRequiredFields', true);
            return;
          }
        }
      })
      .catch(console.log);
    },

    problemCreate: function() {
      this.createProblem();
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


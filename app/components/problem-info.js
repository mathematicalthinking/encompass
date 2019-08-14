/*global _:false */
Encompass.ProblemInfoComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {
  elementId: 'problem-info',
  classNames: ['side-info'],
  isEditing: false,
  showGeneral: true,
  problemName: null,
  problemText: null,
  problemPublic: true,
  privacySetting: null,
  savedProblem: null,
  showFlagReason: false,
  isWide: false,
  checked: true,
  filesToBeUploaded: null,
  isProblemUsed: false,
  showAssignment: false,
  problemList: [],
  sectionList: null,
  updateProblemErrors: [],
  imageUploadErrors: [],
  findRecordErrors: [],
  createRecordErrors: [],
  isMissingRequiredFields: null,
  showCategories: false,
  alert: Ember.inject.service('sweet-alert'),
  permissions: Ember.inject.service('problem-permissions'),
  utils: Ember.inject.service('utility-methods'),

  canEdit: Ember.computed.alias('writePermissions.canEdit'),
  canDelete: Ember.computed.alias('writePermissions.canDelete'),
  canAssign: Ember.computed.alias('writePermissions.canAssign'),
  recommendedProblems: Ember.computed.alias('currentUser.organization.recommendedProblems'),
  parentActions: Ember.computed.alias("parentView.actions"),

  iconFillOptions: {
    approved: '#35A853',
    pending: '#FFD204',
    flagged: '#EB5757'
  },
  problemStatusOptions: ['approved', 'pending', 'flagged'],
  flagOptions: {
    'inappropiate': 'Inappropriate Content',
    'ip': 'Intellectual Property Concern',
    'substance': 'Lacking Substance',
    'other': 'Other Reason'
  },

  init: function () {
    this._super(...arguments);
    this.set('keywordFilter', this.createKeywordFilter.bind(this));

    this.get('store').findAll('section').then(sections => {
      this.set('sectionList', sections);
    }).catch((err) => {
      this.handleErrors(err, 'findRecordErrors');
    });
  },

  didInsertElement() {
    $('.list-outlet').removeClass('hidden');
    this._super(...arguments);
  },

  didUpdateAttrs() {
    let attrProbId = this.get('problem.id');
    let currentId = this.get('currentProblemId');
    if (!_.isEqual(attrProbId, currentId)) {
      if (this.get('isEditing')) {
        this.set('isEditing', false);
      }
      if (this.get('isForEdit')) {
        this.set('isForEdit', false);
      }
    }
    this._super(...arguments);
  },

  didReceiveAttrs: function () {
    let currentProblemId = this.get('currentProblemId');
    if (_.isUndefined(currentProblemId)) {
      this.set('currentProblemId', this.get('problem.id'));
    }
    this.set('isWide', false);
    this.set('showAssignment', false);

    let problem = this.get('problem');
    this.set('writePermissions', this.get('permissions').writePermissions(problem));

    this.get('store').findAll('section').then(sections => {
      this.set('sectionList', sections);
      if (problem.get('isForEdit')) {
        this.send('editProblem');
      }
      if (problem.get('isForAssignment')) {
        this.send('showAssignment');
      }
    }).catch((err) => {
      this.handleErrors(err, 'findRecordErrors');
    });

    let problemFlagReason = problem.get('flagReason');
    if (problemFlagReason) {
      let flaggedBy = problemFlagReason.flaggedBy;
      this.get('store').findRecord('user', flaggedBy).then((user) => {
        this.set('flaggedBy', user);
      });
    }
  },

  willDestroyElement: function() {
    // hide outlet, but don't transition to list because topbar link-to takes care of that
    this.send('hideInfo', false);
    this._super(...arguments);
  },

  statusIconFill: function () {
    let status = this.get('problem.status');

    return this.get('iconFillOptions')[status];
  }.property('problem.status'),

  resetErrors: function() {
    let errors = ['updateProblemErrors', 'imageUploadErrors', 'isMissingRequiredFields'];
    for (let error of errors) {
      if (this.get(error)) {
        this.set(error, null);
      }
    }
  },
  // Empty quill editor .html() property returns <p><br></p>
  // For quill to not be empty, there must either be some text or
  // a student must have uploaded an img so there must be an img tag
  isQuillValid: function() {
    return !this.get('isQuillEmpty') && !this.get('isQuillTooLong');

  },

  orgOptions: function () {
    return this.get('store').findAll('organization').then((orgs) => {
      let orgList = orgs.get('content');
      let toArray = orgList.toArray();
      return toArray.map((org) => {
        return {
          id: org.id,
          name: org._data.name
        };
      });
    });
  },

  keywordSelectOptions: function() {
    let keywords = this.get('problem.keywords');
    if (!_.isArray(keywords)) {
      return [];
    }
    return _.map(keywords, (keyword) => {
      return {
        value: keyword,
        label: keyword
      };
    });
  }.property('problem.keywords.[]'),

  isRecommended: function () {
    let problem = this.get('problem');
    let recommendedProblems = this.get('recommendedProblems') || [];
    if (recommendedProblems.includes(problem)) {
      return true;
    } else {
      return false;
    }
  }.property('problem.id', 'recommendedProblems.[]'),

  createKeywordFilter(keyword) {
    if (!keyword) {
      return;
    }
    let keywords = this.$('#select-edit-keywords')[0].selectize.items;
    let keywordLower = keyword.trim().toLowerCase();

    let keywordsLower = _.map(keywords, (key, val) => {
      return key.toLowerCase();
    });

    // don't let user create keyword if it matches exactly an existing keyword
    return !_.contains(keywordsLower, keywordLower);
  },

  actions: {
    deleteProblem: function () {
      let problem = this.get('problem');
      this.get('alert').showModal('warning', 'Are you sure you want to delete this problem?', null, 'Yes, delete it')
      .then((result) => {
        if (result.value) {
          this.send('hideInfo');
          problem.set('isTrashed', true);
          window.history.back();
          problem.save().then((problem) => {
            this.get('alert').showToast('success', 'Problem Deleted', 'bottom-end', 5000, true, 'Undo')
            .then((result) => {
              if (result.value) {
                problem.set('isTrashed', false);
                problem.save().then(() => {
                  this.get('alert').showToast('success', 'Problem Restored', 'bottom-end', 3000, false, null);
                  window.history.back();
                });
              }
            });
          }).catch((err) => {
            this.handleErrors(err, 'updateProblemErrors', problem);
          });
        }
      });
    },

    editProblem: function () {
      let problem = this.get('problem');
      let problemId = problem.get('id');
      let currentUserAccountType = this.get('currentUser').get('accountType');
      let isAdmin = currentUserAccountType === "A";
      this.set('copyrightNotice', problem.get('copyrightNotice'));
      this.set('sharingAuth', problem.get('sharingAuth'));
      this.set('author', problem.get('author'));
      this.set('problemName', problem.get('title'));
      this.set('problemText', problem.get('text'));
      this.set('organization', problem.get('organization'));
      this.set('problemCategories', problem.get('categories'));
      this.set('problemStatus', problem.get('status'));
      this.set('additionalInfo', problem.get('additionalInfo'));
      this.set('privacySetting', problem.get('privacySetting'));
      this.set('sharingAuth', problem.get('sharingAuth'));
      this.set('privacySettingIcon', problem.get('privacySetting'));

      let keywords = problem.get('keywords') || [];

      let keywordsCopy = keywords.slice();
      this.set('initialKeywords', keywordsCopy);

      if (!problem.get('isUsed')) {
        this.get('store').queryRecord('assignment', {
          problem: problemId
        }).then(assignment => {
          if (assignment !== null) {
            this.get('alert').showModal('warning', 'Are you sure you want to edit a problem that has already been assigned', 'This problem has been used in an assignment but no answers have been submitted yet. Be careful editing the content of this problem', 'Yes').then((result) => {
              if (result.value) {
                this.send('continueEdit');
              }
            });
          } else {
            this.send('continueEdit');
          }
        });
      } else {
        if (isAdmin) {
          this.get('alert').showModal('warning', 'Are you sure you want to edit a problem with answers?', 'Be careful changing the content of this problem because changes will be made everywhere this problem is used', 'Yes')
          .then((result) => {
            if (result.value) {
              this.send('continueEdit');
            }
          });
        }
      }
    },

    continueEdit: function () {
      this.set('showEditWarning', false);
      this.set('isEditing', true);
      let problem = this.get('problem');
      this.set('problemName', problem.get('title'));
      this.set('problemText', problem.get('text'));
      this.set('privacySetting', problem.get('privacySetting'));
    },

    cancelEdit: function () {
      this.set('isEditing', false);

      let problem = this.get('problem');
      if (problem.get('isForEdit')) {
        problem.set('isForEdit', false);
      }
      this.resetErrors();
    },

    radioSelect: function (value) {
      this.set('privacySetting', value);
    },

    changePrivacy: function () {
      let privacy = $("#privacy-select :selected").val();
      this.set('privacySettingIcon', privacy);
    },

    checkPrivacy: function() {
      let currentPrivacy = this.problem.get('privacySetting');
      let privacy = $("#privacy-select :selected").val();
      this.set('privacySetting', privacy);

      if (currentPrivacy !== "E" && privacy === "E") {
        this.get('alert').showModal('question', 'Are you sure you want to make your problem public?', "You are changing your problem's privacy status to public. This means it will be accessible to all EnCoMPASS users. You will not be able to make any changes to this problem once it has been used", 'Yes')
        .then((result) => {
          if (result.value) {
            this.send('setStatus');
          }
        });
      } else {
        this.send('setStatus');
      }
    },

    setStatus: function () {
      let problem = this.get('problem');
      let currentUser = this.get('currentUser');
      let accountType = currentUser.get('accountType');
      let privacy = this.get('privacySetting');
      let originalPrivacy = problem.get('privacySetting');
      let status;

      if (originalPrivacy !== privacy) {
        if (accountType === "A") {
          status = this.get('problemStatus');
        } else if (accountType === "P") {
          if (privacy === "E") {
            status = 'pending';
          } else {
            status = this.get('problemStatus');
          }
        } else {
          if (privacy === "M") {
            status = 'approved';
          } else {
            status = 'pending';
          }
        }
      } else {
        status = this.get('problemStatus');
      }

      this.set('generatedStatus', status);

      if (accountType === "A" || accountType === "P") {
        this.send('checkStatus');
      } else {
        this.send('updateProblem');
      }
    },

    checkStatus: function () {
      let currentUser = this.get('currentUser');
      let status = this.get('generatedStatus');
      let problem = this.get('problem');
      let title = this.get('problemName');
      let flaggedReason = {
        flaggedBy: currentUser.get('id'),
        reason: '',
        flaggedDate: new Date(),
      };

      if (status === "approved" || status === "pending") {
        this.set('flaggedReason', null);
        this.send('updateProblem');
      } else if (status === "flagged" && !problem.get('flagReason')) {
        this.get('alert').showModal('warning', `Are you sure you want to mark ${title} as flagged`, null, `Yes, Flag it!`).then((result) => {
          if (result.value) {
            this.get('alert').showPromptSelect('Flag Reason', this.get('flagOptions'), 'Select a reason')
              .then((result) => {
                if (result.value) {
                  if (result.value === 'other') {
                    this.get('alert').showPrompt('text', 'Other Flag Reason', 'Please provide a brief explanation for why this problem should be flagged.', 'Flag')
                      .then((result) => {
                        if (result.value) {
                          flaggedReason.reason = result.value;
                          this.set('flaggedBy', currentUser);
                          this.set('flaggedReason', flaggedReason);
                          this.send('updateProblem');
                        }
                      });
                  } else {
                    flaggedReason.reason = result.value;
                    this.set('flaggedBy', currentUser);
                    this.set('flaggedReason', flaggedReason);
                    this.send('updateProblem');
                  }
                }
              });
          }
        });
      }
    },

    updateProblem: function () {
      let problem = this.get('problem');
      let currentUser = this.get('currentUser');
      let title = this.get('problemName').trim();
      const quillContent = this.$('.ql-editor').html();
      let text;
      let isQuillValid;

      if (quillContent !== undefined) {
        text = quillContent.replace(/["]/g, "'");
        isQuillValid = this.isQuillValid();
      } else {
        text = problem.get('text');
        isQuillValid = true;
      }
      let privacy = this.get('privacySetting');
      let additionalInfo = this.get('additionalInfo');
      let copyright = this.get('copyrightNotice');
      let sharingAuth = this.get('sharingAuth');

      let keywords = problem.get('keywords');
      let initialKeywords = this.get('initialKeywords');
      let didKeywordsChange = !_.isEqual(keywords, initialKeywords);

      let flaggedReason = this.get('flaggedReason');

      let author = this.get('author');
      let status = this.get('generatedStatus');

      if (!title || !isQuillValid|| !privacy) {
        this.set('isMissingRequiredFields', true);
        return;
      } else {
        if (this.get('isMissingRequiredFields')) {
          this.set('isMissingRequiredFields', null);
        }
      }

      if (privacy !== null) {
        problem.set('privacySetting', privacy);
      }

      problem.set('title', title);
      problem.set('text', text);
      problem.set('additionalInfo', additionalInfo);
      problem.set('copyrightNotice', copyright);
      problem.set('sharingAuth', sharingAuth);
      problem.set('author', author);
      problem.set('status', status);
      problem.set('flagReason', flaggedReason);

      if(this.filesToBeUploaded) {
        var uploadData = this.get('filesToBeUploaded');
        var formData = new FormData();
        for (let f of uploadData) {
          formData.append('photo', f);
        }
        let firstItem = uploadData[0];
        let isPDF = firstItem.type === 'application/pdf';

        if (isPDF) {
          Ember.$.post({
            url: '/pdf',
            processData: false,
            contentType: false,
            data: formData
          }).then((res) => {
            this.set('uploadResults', res.images);
            this.store.findRecord('image', res.images[0]._id).then((image) => {
              problem.set('image', image);
              problem.save().then((res) => {
                this.get('alert').showToast('success', 'Problem Updated', 'bottom-end', 3000, false, null);
                // handle success
                this.set('isEditing', false);
                if (problem.get('isForEdit')) {
                  problem.set('isForEdit', false);
                }
                this.resetErrors();
              })
              .catch((err) => {
                this.handleErrors(err, 'updateProblemErrors', problem);
                this.set('showConfirmModal', false);
              });
            });
          })
          .catch((err) => {
            this.handleErrors(err, 'imageUploadErrors');
          });
        } else {
          Ember.$.post({
            url: '/image',
            processData: false,
            contentType: false,
            data: formData
          }).then((res) => {
            this.set('uploadResults', res.images);
            this.store.findRecord('image', res.images[0]._id).then((image) => {
              problem.set('image', image);
              problem.save().then((res) => {
                this.get('alert').showToast('success', 'Problem Updated', 'bottom-end', 3000, false, null);
                this.set('isEditing', false);
                if (problem.get('isForEdit')) {
                  problem.set('isForEdit', false);
                }
                this.resetErrors();
              })
              .catch((err) => {
                this.handleErrors(err, 'updateProblemErrors', problem);
                this.set('showConfirmModal', false);
              });
            });
          })
          .catch((err) =>{
            this.handleErrors(err, 'imageUploadErrors');
          });
        }
      } else {
        if (problem.get('hasDirtyAttributes') || didKeywordsChange) {
          problem.set('modifiedBy', currentUser);
          problem.save().then(() => {
            this.get('alert').showToast('success', 'Problem Updated', 'bottom-end', 3000, false, null);
            this.resetErrors();
            this.set('showConfirmModal', false);
            this.set('isEditing', false);
            if (problem.get('isForEdit')) {
              problem.set('isForEdit', false);
            }
          })
          .catch((err) => {
            this.handleErrors(err, 'updateProblemErrors', problem);
            this.set('showConfirmModal', false);
            return;
          });
        } else {
          this.set('isEditing', false);
        }
      }
    },

    addToMyProblems: function() {
      let problem = this.get('problem');
      let originalTitle = problem.get('title');
      let title = 'Copy of ' + originalTitle;
      let text = problem.get('text');
      let author = problem.get('author');
      let additionalInfo = problem.get('additionalInfo');
      let isPublic = problem.get('isPublic');
      let image = problem.get('image');
      let imageUrl = problem.get('imageUrl');
      let createdBy = this.get('currentUser');
      let categories = problem.get('categories');
      let status = problem.get('status');
      let currentUser = this.get('currentUser');
      let keywords = problem.get('keywords');
      let organization = currentUser.get('organization');
      let copyright = problem.get('copyrightNotice');
      let sharingAuth = problem.get('sharingAuth');

      let newProblem = this.store.createRecord('problem', {
        title: title,
        text: text,
        author: author,
        additionalInfo: additionalInfo,
        imageUrl: imageUrl,
        isPublic: isPublic,
        origin: problem,
        categories: categories,
        createdBy: createdBy,
        image: image,
        organization: organization,
        privacySetting: "M",
        copyrightNotice: copyright,
        sharingAuth: sharingAuth,
        status: status,
        createDate: new Date(),
        keywords: keywords
      });

      newProblem.save()
        .then((problem) => {
          let name = problem.get('title');
          this.set('savedProblem', problem);
          this.get('alert').showToast('success', `${name} added to your problems`, 'bottom-end', 3000, false, null);
          let parentView = this.get('parentView');
          this.get('parentActions.refreshList').call(parentView);
        }).catch((err) => {
          this.get('alert').showToast('error', `${err}`, 'bottom-end', 3000, false, null);
          // this.handleErrors(err, 'createRecordErrors', newProblem);
        });
    },

    toggleImageSize: function () {
      this.toggleProperty('isWide');
    },

    deleteImage: function () {
      let problem = this.get('problem');
      problem.set('image', null);
      problem.save().then((res) => {
        this.get('alert').showToast('success', 'Image Deleted', 'bottom-end', 3000, false, null);
      })
      .catch((err) => {
        this.handleErrors(err, 'updateProblemErrors', problem);
      });
    },

    showCategories: function () {
      this.get('store').query('category', {}).then((queryCats) => {
        let categories = queryCats.get('meta');
        this.set('categoryTree', categories.categories);
      });
      this.set('showCategories', !(this.get('showCategories')));
    },

    addCategories: function (category) {
      let problem = this.get('problem');
      let categories = problem.get('categories');
      if (!categories.includes(category)) {
        categories.pushObject(category);
        problem.save().then(() => {
          this.get('alert').showToast('success', 'Category Added', 'bottom-end', 4000, true, 'Undo')
          .then((result) => {
            if (result.value) {
              problem.get('categories').removeObject(category);
              problem.save().then(() => {
                this.get('alert').showToast('success', 'Category Removed', 'bottom-end', 4000, false, null);
              });
            }
          });
        });
      }
    },

    removeCategory: function (category) {
      let problem = this.get('problem');
      let categories = problem.get('categories');
      categories.removeObject(category);
      problem.save().then(() => {
        this.get('alert').showToast('success', 'Category Removed', 'bottom-end', 4000, true, 'Undo')
        .then((result) => {
          if (result.value) {
            problem.get('categories').pushObject(category);
            problem.save().then(() => {
              this.get('alert').showToast('success', 'Category Restored', 'bottom-end', 4000, false, null);
            });
          }
        });
      });
    },

    toAssignmentInfo: function (assignment) {
      this.sendAction('toAssignmentInfo', assignment);
    },

    showAssignment: function () {
      this.set('showAssignment', true);
      this.get('problemList').pushObject(this.problem);
      var scr = $('#outlet')[0].scrollHeight;
      $('#outlet').animate({ scrollTop: scr }, 100);
    },

    hideInfo: function (doTransition=true) {
      // transition back to list

      if (this.get('isEditing')) {
        this.set('isEditing', false);
      }
      let problem = this.get('problem');
      if (problem.get('isForEdit')) {
        problem.set('isForEdit', false);
      }
      $('.list-outlet').addClass('hidden');
      if (doTransition) {
        this.sendAction('toProblemList');
      }

    },

    checkRecommend: function () {
      let currentUser = this.get('currentUser');
      let accountType = currentUser.get('accountType');
      let problem = this.get('problem');
      let privacySetting = problem.get('privacySetting');
      let status = problem.get('status');

      if (accountType === 'T') {
        return;
      }

      if (privacySetting === 'M') {
        this.get('alert').showModal('warning', 'Are you sure you want to recommend a private problem?', 'Regular users will not see this problem in their recommended list', 'Yes').then((result) => {
          if (result.value) {
            this.send('addToRecommend');
          }
        });
      }

      if (status !== 'approved') {
        this.get('alert').showModal('warning', 'Are you sure you want to recommend an unapproved problem?', 'Regular users will not see this problem in their recommended list', 'Yes').then((result) => {
          if (result.value) {
            this.send('addToRecommend');
          }
        });
      }

      if (status === 'approved' && privacySetting !== 'M') {
        this.send('addToRecommend');
      }
    },

    addToRecommend: function () {
      let problem = this.get('problem');
      let accountType = this.get('currentUser.accountType');
      if (accountType === "A") {
        this.orgOptions().then((orgs) => {
          this.set('orgList', orgs);
          let orgList = this.get('orgList');
          let optionList = {};
          for (let org of orgList) {
            let id = org.id;
            let name = org.name;
            optionList[id] = name;
          }
          return this.get('alert').showPromptSelect('Select Organization', optionList, 'Select an organization')
          .then((result) => {
            if (result.value) {
              let orgId = result.value;
              this.get('store').findRecord('organization', orgId).then((org) => {
                org.get('recommendedProblems').addObject(problem);
                org.save().then(() => {
                  this.get('alert').showToast('success', 'Added to Recommended', 'bottom-end', 3000, false, null);
                });
              });
            }
          });
        });
      } else if (accountType === "P") {
        return this.get('currentUser').get('organization').then((org) => {
          org.get('recommendedProblems').addObject(problem);
          org.save().then(() => {
            this.get('alert').showToast('success', 'Added to Recommended', 'bottom-end', 3000, false, null);
          });
        });
      } else {
        return;
      }
    },

    removeRecommend: function () {
      let problem = this.get('problem');
      return this.get('currentUser').get('organization').then((org) => {
        org.get('recommendedProblems').removeObject(problem);
        org.save().then(() => {
          this.get('alert').showToast('success', 'Removed from Recommended', 'bottom-end', 3000, false, null);
        });
      });
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

    restoreProblem: function () {
      let problem = this.get('problem');
      this.get('alert').showModal('warning', 'Are you sure you want to restore this problem?', null, 'Yes, restore')
        .then((result) => {
          if (result.value) {
            problem.set('isTrashed', false);
            problem.save().then(() => {
              this.get('alert').showToast('success', 'Problem Restored', 'bottom-end', 3000, false, null);
              let parentView = this.get('parentView');
              this.get('parentActions.refreshList').call(parentView);
            });
          }
        });
    },

    toggleShowFlagReason: function () {
      this.set('showFlagReason', !this.get('showFlagReason'));
    },
    updateKeywords(val, $item) {
      if (!val) {
        return;
      }

      let keywords = this.get('problem.keywords');
      if (!_.isArray(keywords)) {
        this.get('problem').set('keywords', []);
        keywords = this.get('problem.keywords');
      }
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
  }
  }
});
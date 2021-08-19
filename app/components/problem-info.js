import ErrorHandlingComponent from './error-handling';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import _ from 'underscore';
import { inject as service } from '@ember/service';
import $ from 'jquery';

export default class ProblemInfoComponent extends ErrorHandlingComponent {
  @tracked isEditing = false;
  @tracked showGeneral = true;
  @tracked problemName = null;
  @tracked problemText = null;
  @tracked problemPublic = true;
  @tracked privacySetting = null;
  @tracked savedProblem = null;
  @tracked showFlagReason = false;
  @tracked isWide = false;
  @tracked checked = true;
  @tracked filesToBeUploaded = null;
  @tracked isProblemUsed = false;
  @tracked showAssignment = false;
  @tracked problemList = [];
  @tracked sectionList = null;
  @tracked updateProblemErrors = [];
  @tracked imageUploadErrors = [];
  @tracked findRecordErrors = [];
  @tracked createRecordErrors = [];
  @tracked isMissingRequiredFields = null;
  @tracked showCategories = false;
  @tracked showGeneral = true;
  @tracked showCats = false;
  @tracked showAdditional = false;
  @tracked showLegal = false;
  @tracked categoryTree = {};
  @service('sweet-alert') alert;
  @service('problem-permissions') permissions;
  @service('utility-methods') utils;
  @service store;
  @service router;
  @tracked copyrightNotice = '';
  @tracked sharingAuth = '';
  @tracked author = '';
  @tracked problemName = '';
  @tracked problemText = '';
  @tracked organization = '';
  @tracked problemCategories = '';
  @tracked problemStatus = '';
  @tracked additionalInfo = '';
  @tracked privacySetting = '';
  @tracked sharingAuth = '';
  @tracked privacySettingIcon = '';
  constructor() {
    super(...arguments);
    $('.list-outlet').removeClass('hidden');
    if (this.args.problem.isForAssignment) {
      this.showAssignment = true;
    }
    if (this.args.problem.isForEdit) {
      this.isEditing = true;
      this.privacySettingIcon = this.args.problem.privacySetting;
    }
  }
  get writePermissions() {
    return this.permissions.writePermissions(this.args.problem);
  }
  get parentActions() {
    return this.parentView.actions;
  }
  get flaggedBy() {
    if (!this.args.problem.get('flagReason.flaggedBy')) return '';
    return this.store.findRecord(
      'user',
      this.args.problem.get('flagReason.flaggedBy')
    );
  }
  iconFillOptions = {
    approved: '#35A853',
    pending: '#FFD204',
    flagged: '#EB5757',
  };
  problemStatusOptions = ['approved', 'pending', 'flagged'];
  flagOptions = {
    inappropiate: 'Inappropriate Content',
    ip: 'Intellectual Property Concern',
    substance: 'Lacking Substance',
    other: 'Other Reason',
  };
  get statusIconFill() {
    let status = this.args.problem.status;
    return this.iconFillOptions[status];
  }

  resetErrors() {
    let errors = [
      'updateProblemErrors',
      'imageUploadErrors',
      'isMissingRequiredFields',
    ];
    for (let error of errors) {
      if (this[error]) {
        this[error] = null;
      }
    }
  }
  // Empty quill editor .html() property returns <p><br></p>
  // For quill to not be empty, there must either be some text or
  // a student must have uploaded an img so there must be an img tag
  isQuillValid() {
    return !this.isQuillEmpty && !this.isQuillTooLong;
  }

  get keywordSelectOptions() {
    let keywords = this.args.problem.keywords;
    if (!_.isArray(keywords)) {
      return [];
    }
    return _.map(keywords, (keyword) => {
      return {
        value: keyword,
        label: keyword,
      };
    });
  }
  get isRecommended() {
    let problem = this.args.problem;
    let recommendedProblems = this.args.recommendedProblems.toArray() || [];
    if (recommendedProblems.includes(problem)) {
      return true;
    } else {
      return false;
    }
  }

  createKeywordFilter(keyword) {
    if (!keyword) {
      return;
    }
    let keywords = $('#select-edit-keywords')[0].selectize.items;
    let keywordLower = keyword.trim().toLowerCase();

    let keywordsLower = _.map(keywords, (key, val) => {
      return key.toLowerCase();
    });

    // don't let user create keyword if it matches exactly an existing keyword
    return !_.contains(keywordsLower, keywordLower);
  }

  continueEdit() {
    this.showEditWarning = false;
    this.isEditing = true;
    let problem = this.args.problem;
    this.problemName = problem.title;
    this.problemText = problem.text;
    this.privacySetting = problem.privacySetting;
  }

  setStatus() {
    let problem = this.args.problem;
    let currentUser = this.args.currentUser;
    let accountType = currentUser.get('accountType');
    let privacy = this.privacySetting;
    let originalPrivacy = problem.get('privacySetting');
    let status;

    if (originalPrivacy !== privacy) {
      if (accountType === 'A') {
        status = this.problemStatus;
      } else if (accountType === 'P') {
        if (privacy === 'E') {
          status = 'pending';
        } else {
          status = this.problemStatus;
        }
      } else {
        if (privacy === 'M') {
          status = 'approved';
        } else {
          status = 'pending';
        }
      }
    } else {
      status = this.problemStatus;
    }

    this.generatedStatus = status;

    if (accountType === 'A' || accountType === 'P') {
      this.checkStatus();
    } else {
      return this.updateProblem();
    }
  }

  updateProblem() {
    let problem = this.args.problem;
    let currentUser = this.args.currentUser;
    let title = this.problemName.trim();
    const quillContent = $('.ql-editor').html();
    let text;
    let isQuillValid;

    if (quillContent !== undefined) {
      text = quillContent.replace(/["]/g, "'");
      isQuillValid = this.isQuillValid();
    } else {
      text = problem.get('text');
      isQuillValid = true;
    }
    let privacy = this.privacySetting;
    let additionalInfo = this.additionalInfo;
    let copyright = this.copyrightNotice;
    let sharingAuth = this.sharingAuth;

    let keywords = problem.get('keywords');
    let initialKeywords = this.initialKeywords;
    let didKeywordsChange = !_.isEqual(keywords, initialKeywords);

    let flaggedReason = this.flaggedReason;

    let author = this.author;
    let status = this.generatedStatus;

    if (!title || !isQuillValid || !privacy) {
      this.isMissingRequiredFields = true;
      return;
    } else {
      if (this.isMissingRequiredFields) {
        this.isMissingRequiredFields = null;
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

    if (this.filesToBeUploaded) {
      var uploadData = this.filesToBeUploaded;
      var formData = new FormData();
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
        })
          .then((res) => {
            this.uploadResults = res.images;
            this.store.findRecord('image', res.images[0]._id).then((image) => {
              problem.set('image', image);
              problem
                .save()
                .then((res) => {
                  this.alert.showToast(
                    'success',
                    'Problem Updated',
                    'bottom-end',
                    3000,
                    false,
                    null
                  );
                  // handle success
                  this.isEditing = false;
                  if (problem.get('isForEdit')) {
                    problem.set('isForEdit', false);
                  }
                  this.resetErrors();
                })
                .catch((err) => {
                  this.handleErrors(err, 'updateProblemErrors', problem);
                  this.showConfirmModal = false;
                });
            });
          })
          .catch((err) => {
            this.handleErrors(err, 'imageUploadErrors');
          });
      } else {
        $.post({
          url: '/image',
          processData: false,
          contentType: false,
          data: formData,
        })
          .then((res) => {
            this.uploadResults = res.images;
            this.store.findRecord('image', res.images[0]._id).then((image) => {
              problem.set('image', image);
              problem
                .save()
                .then((res) => {
                  this.alert.showToast(
                    'success',
                    'Problem Updated',
                    'bottom-end',
                    3000,
                    false,
                    null
                  );
                  this.isEditing = false;
                  if (problem.get('isForEdit')) {
                    problem.set('isForEdit', false);
                  }
                  this.resetErrors();
                })
                .catch((err) => {
                  this.handleErrors(err, 'updateProblemErrors', problem);
                  this.showConfirmModal = false;
                });
            });
          })
          .catch((err) => {
            this.handleErrors(err, 'imageUploadErrors');
          });
      }
    } else {
      if (problem.get('hasDirtyAttributes') || didKeywordsChange) {
        problem.set('modifiedBy', currentUser);
        problem
          .save()
          .then(() => {
            this.alert.showToast(
              'success',
              'Problem Updated',
              'bottom-end',
              3000,
              false,
              null
            );
            this.resetErrors();
            this.showConfirmModal = false;
            this.isEditing = false;
            if (problem.get('isForEdit')) {
              problem.set('isForEdit', false);
            }
          })
          .catch((err) => {
            this.handleErrors(err, 'updateProblemErrors', problem);
            this.showConfirmModal = false;
            return;
          });
      } else {
        this.isEditing = false;
      }
    }
  }

  @action deleteProblem() {
    let problem = this.args.problem;
    this.alert
      .showModal(
        'warning',
        'Are you sure you want to delete this problem?',
        null,
        'Yes, delete it'
      )
      .then((result) => {
        if (result.value) {
          this.hideInfo();
          problem.set('isTrashed', true);
          window.history.back();
          problem
            .save()
            .then((problem) => {
              this.alert
                .showToast(
                  'success',
                  'Problem Deleted',
                  'bottom-end',
                  5000,
                  true,
                  'Undo'
                )
                .then((result) => {
                  if (result.value) {
                    problem.set('isTrashed', false);
                    problem.save().then(() => {
                      this.alert.showToast(
                        'success',
                        'Problem Restored',
                        'bottom-end',
                        3000,
                        false,
                        null
                      );
                      window.history.back();
                    });
                  }
                });
            })
            .catch((err) => {
              this.handleErrors(err, 'updateProblemErrors', problem);
            });
        }
      });
  }

  @action editProblem() {
    let problem = this.args.problem;
    let problemId = problem.get('id');
    let currentUserAccountType = this.args.currentUser.get('accountType');
    let isAdmin = currentUserAccountType === 'A';
    this.copyrightNotice = problem.copyrightNotice;
    this.sharingAuth = problem.sharingAuth;
    this.author = problem.author;
    this.problemName = problem.title;
    this.problemText = problem.text;
    this.organization = problem.organization;
    this.problemCategories = problem.categories;
    this.problemStatus = problem.status;
    this.additionalInfo = problem.additionalInfo;
    this.privacySetting = problem.privacySetting;
    this.sharingAuth = problem.sharingAuth;
    this.privacySettingIcon = problem.privacySetting;

    let keywords = problem.get('keywords') || [];

    let keywordsCopy = keywords.slice();
    this.initialKeywords = keywordsCopy;

    if (!problem.get('isUsed')) {
      this.store
        .queryRecord('assignment', {
          problem: problemId,
        })
        .then((assignment) => {
          if (assignment !== null) {
            this.alert
              .showModal(
                'warning',
                'Are you sure you want to edit a problem that has already been assigned',
                'This problem has been used in an assignment but no answers have been submitted yet. Be careful editing the content of this problem',
                'Yes'
              )
              .then((result) => {
                if (result.value) {
                  return this.continueEdit();
                }
              });
          } else {
            return this.continueEdit();
          }
        });
    } else {
      if (isAdmin) {
        this.alert
          .showModal(
            'warning',
            'Are you sure you want to edit a problem with answers?',
            'Be careful changing the content of this problem because changes will be made everywhere this problem is used',
            'Yes'
          )
          .then((result) => {
            if (result.value) {
              return this.continueEdit();
            }
          });
      }
    }
  }

  @action cancelEdit() {
    this.isEditing = false;

    let problem = this.args.problem;
    if (problem.get('isForEdit')) {
      problem.set('isForEdit', false);
    }
    this.resetErrors();
  }

  @action radioSelect(value) {
    this.privacySetting = value;
  }

  @action changePrivacy() {
    let privacy = $('#privacy-select :selected').val();
    this.privacySettingIcon = privacy;
  }

  @action checkPrivacy() {
    let currentPrivacy = this.args.problem.get('privacySetting');
    let privacy = $('#privacy-select :selected').val();
    this.privacySetting = privacy;

    if (currentPrivacy !== 'E' && privacy === 'E') {
      this.alert
        .showModal(
          'question',
          'Are you sure you want to make your problem public?',
          "You are changing your problem's privacy status to public. This means it will be accessible to all EnCoMPASS users. You will not be able to make any changes to this problem once it has been used",
          'Yes'
        )
        .then((result) => {
          if (result.value) {
            return this.setStatus();
          }
        });
    } else {
      return this.setStatus();
    }
  }

  @action checkStatus() {
    let currentUser = this.args.currentUser;
    let status = this.generatedStatus;
    let problem = this.args.problem;
    let title = this.problemName;
    let flaggedReason = {
      flaggedBy: currentUser.get('id'),
      reason: '',
      flaggedDate: new Date(),
    };

    if (status === 'approved' || status === 'pending') {
      this.flaggedReason = null;
      return this.updateProblem();
    } else if (status === 'flagged' && !problem.get('flagReason')) {
      this.alert
        .showModal(
          'warning',
          `Are you sure you want to mark ${title} as flagged`,
          null,
          `Yes, Flag it!`
        )
        .then((result) => {
          if (result.value) {
            this.alert
              .showPromptSelect(
                'Flag Reason',
                this.flagOptions,
                'Select a reason'
              )
              .then((result) => {
                if (result.value) {
                  if (result.value === 'other') {
                    this.alert
                      .showPrompt(
                        'text',
                        'Other Flag Reason',
                        'Please provide a brief explanation for why this problem should be flagged.',
                        'Flag'
                      )
                      .then((result) => {
                        if (result.value) {
                          flaggedReason.reason = result.value;
                          this.flaggedBy = currentUser;
                          this.flaggedReason = flaggedReason;
                          return this.updateProblem();
                        }
                      });
                  } else {
                    flaggedReason.reason = result.value;
                    this.flaggedBy = currentUser;
                    this.flaggedReason = flaggedReason;
                    return this.updateProblem();
                  }
                }
              });
          }
        });
    }
  }

  @action addToMyProblems() {
    let problem = this.args.problem;
    let originalTitle = problem.get('title');
    let title = 'Copy of ' + originalTitle;
    let text = problem.get('text');
    let author = problem.get('author');
    let additionalInfo = problem.get('additionalInfo');
    let isPublic = problem.get('isPublic');
    let image = problem.get('image');
    let imageUrl = problem.get('imageUrl');
    let createdBy = this.args.currentUser;
    let categories = problem.get('categories');
    let status = problem.get('status');
    let currentUser = this.args.currentUser;
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
      privacySetting: 'M',
      copyrightNotice: copyright,
      sharingAuth: sharingAuth,
      status: status,
      createDate: new Date(),
      keywords: keywords,
    });

    newProblem
      .save()
      .then((problem) => {
        let name = problem.get('title');
        this.savedProblem = problem;
        this.alert.showToast(
          'success',
          `${name} added to your problems`,
          'bottom-end',
          3000,
          false,
          null
        );
        this.router.transitionTo('problems.problem', problem.id);
        // let parentView = this.parentView;
        // this.parentActions.refreshList.call(parentView);
      })
      .catch((err) => {
        this.alert.showToast(
          'error',
          `${err}`,
          'bottom-end',
          3000,
          false,
          null
        );
        // this.handleErrors(err, 'createRecordErrors', newProblem);
      });
  }

  @action toggleImageSize() {
    this.isWide = !this.isWide;
  }

  @action deleteImage() {
    let problem = this.args.problem;
    problem.set('image', null);
    problem
      .save()
      .then((res) => {
        this.alert.showToast(
          'success',
          'Image Deleted',
          'bottom-end',
          3000,
          false,
          null
        );
      })
      .catch((err) => {
        this.handleErrors(err, 'updateProblemErrors', problem);
      });
  }

  @action toggleCategories() {
    this.store.query('category', {}).then((queryCats) => {
      let categories = queryCats.get('meta');
      this.categoryTree = categories.categories;
    });
    this.showCategories = !this.showCategories;
  }

  @action addCategories(category) {
    let problem = this.args.problem;
    let categories = problem.get('categories');
    if (!categories.includes(category)) {
      categories.pushObject(category);
      problem.save().then(() => {
        this.alert
          .showToast(
            'success',
            'Category Added',
            'bottom-end',
            4000,
            true,
            'Undo'
          )
          .then((result) => {
            if (result.value) {
              problem.get('categories').removeObject(category);
              problem.save().then(() => {
                this.alert.showToast(
                  'success',
                  'Category Removed',
                  'bottom-end',
                  4000,
                  false,
                  null
                );
              });
            }
          });
      });
    }
  }

  @action removeCategory(category) {
    let problem = this.args.problem;
    let categories = problem.get('categories');
    categories.removeObject(category);
    problem.save().then(() => {
      this.alert
        .showToast(
          'success',
          'Category Removed',
          'bottom-end',
          4000,
          true,
          'Undo'
        )
        .then((result) => {
          if (result.value) {
            problem.get('categories').pushObject(category);
            problem.save().then(() => {
              this.alert.showToast(
                'success',
                'Category Restored',
                'bottom-end',
                4000,
                false,
                null
              );
            });
          }
        });
    });
  }

  @action toAssignmentInfo(assignment) {
    this.router.transitionTo('assignments.assignment', assignment);
  }

  @action toggleAssignment() {
    this.showAssignment = true;
    this.problemList.pushObject(this.args.problem);
    var scr = $('#outlet')[0].scrollHeight;
    $('#outlet').animate({ scrollTop: scr }, 100);
  }

  @action hideInfo(doTransition = true) {
    // transition back to list

    if (this.isEditing) {
      this.isEditing = false;
    }
    let problem = this.args.problem;
    if (problem.isForEdit) {
      problem.isForEdit = false;
    }
    $('.list-outlet').addClass('hidden');
    if (doTransition) {
      this.router.transitionTo('problems');
    }
  }

  @action checkRecommend() {
    let currentUser = this.args.currentUser;
    let accountType = currentUser.get('accountType');
    let problem = this.args.problem;
    let privacySetting = problem.get('privacySetting');
    let status = problem.get('status');

    if (accountType === 'T') {
      return;
    }

    if (privacySetting === 'M') {
      this.alert
        .showModal(
          'warning',
          'Are you sure you want to recommend a private problem?',
          'Regular users will not see this problem in their recommended list',
          'Yes'
        )
        .then((result) => {
          if (result.value) {
            this.addToRecommend();
          }
        });
    }

    if (status !== 'approved') {
      this.alert
        .showModal(
          'warning',
          'Are you sure you want to recommend an unapproved problem?',
          'Regular users will not see this problem in their recommended list',
          'Yes'
        )
        .then((result) => {
          if (result.value) {
            this.addToRecommend();
          }
        });
    }

    if (status === 'approved' && privacySetting !== 'M') {
      this.addToRecommend();
    }
  }

  @action addToRecommend() {
    let problem = this.args.problem;
    let accountType = this.args.currentUser.accountType;
    if (accountType === 'A') {
      let orgList = this.args.orgList.toArray();
      let optionList = {};
      for (let org of orgList) {
        let id = org.id;
        let name = org.name;
        optionList[id] = name;
      }
      return this.alert
        .showPromptSelect(
          'Select Organization',
          optionList,
          'Select an organization'
        )
        .then((result) => {
          if (result.value) {
            let orgId = result.value;
            this.store.findRecord('organization', orgId).then((org) => {
              org.get('recommendedProblems').addObject(problem);
              org.save().then(() => {
                this.alert.showToast(
                  'success',
                  'Added to Recommended',
                  'bottom-end',
                  3000,
                  false,
                  null
                );
              });
            });
          }
        });
    } else if (accountType === 'P') {
      return this.args.currentUser.get('organization').then((org) => {
        org.get('recommendedProblems').addObject(problem);
        org.save().then(() => {
          this.alert.showToast(
            'success',
            'Added to Recommended',
            'bottom-end',
            3000,
            false,
            null
          );
        });
      });
    } else {
      return;
    }
  }

  @action removeRecommend() {
    let problem = this.args.problem;
    return this.args.currentUser.get('organization').then((org) => {
      org.get('recommendedProblems').removeObject(problem);
      org.save().then(() => {
        this.alert.showToast(
          'success',
          'Removed from Recommended',
          'bottom-end',
          3000,
          false,
          null
        );
      });
    });
  }

  @action toggleGeneral() {
    this.showGeneral = true;
    this.showCats = false;
    this.showAdditional = false;
    this.showLegal = false;
  }

  @action toggleCats() {
    this.showCats = true;
    this.showGeneral = false;
    this.showAdditional = false;
    this.showLegal = false;
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

  @action restoreProblem() {
    let problem = this.args.problem;
    this.alert
      .showModal(
        'warning',
        'Are you sure you want to restore this problem?',
        null,
        'Yes, restore'
      )
      .then((result) => {
        if (result.value) {
          problem.set('isTrashed', false);
          problem.save().then(() => {
            this.alert.showToast(
              'success',
              'Problem Restored',
              'bottom-end',
              3000,
              false,
              null
            );
            let parentView = this.parentView;
            this.parentActions.refreshList.call(parentView);
          });
        }
      });
  }

  @action toggleShowFlagReason() {
    this.showFlagReason = !this.showFlagReason;
  }
  @action updateKeywords(val, $item) {
    if (!val) {
      return;
    }

    let keywords = this.args.problem.keywords;
    if (!_.isArray(keywords)) {
      this.args.problem.keywords = [];
      keywords = this.args.problem.keywords;
    }
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

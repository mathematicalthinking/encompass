import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import _isEqual from 'lodash/isEqual';
import _isNull from 'lodash/isNull';
import { service } from '@ember/service';
import $ from 'jquery';

export default class ProblemInfoComponent extends Component {
  @service('sweet-alert') alert;
  @service('problem-permissions') permissions;
  @service('utility-methods') utils;
  @service store;
  @service router;
  @service currentUser;
  @service errorHandling;
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
  @tracked isMissingRequiredFields = false;
  @tracked showCategories = false;
  @tracked showGeneral = true;
  @tracked showCats = false;
  @tracked showAdditional = false;
  @tracked showLegal = false;
  @tracked categoryTree = [];
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
    const outletEl = document.getElementById('outlet');
    if (outletEl) {
      outletEl.classList.remove('hidden');
    }

    if (this.args.isEditing) {
      this.privacySettingIcon = this.args.problem.privacySetting;
      this.copyrightNotice = this.args.problem.copyrightNotice;
      this.sharingAuth = this.args.problem.sharingAuth;
      this.author = this.args.problem.author;
      this.problemName = this.args.problem.title;
      this.problemText = this.args.problem.text;
      this.organization = this.args.problem.organization;
      this.problemCategories = this.args.problem.categories;
      this.problemStatus = this.args.problem.status;
      this.additionalInfo = this.args.problem.additionalInfo;
      this.privacySetting = this.args.problem.privacySetting;
      this.sharingAuth = this.args.problem.sharingAuth;
    }
    this.loadCategoryTree();
  }

  async loadCategoryTree() {
    let queryCats = await this.store.query('category', {});
    let categories = queryCats.meta;
    this.categoryTree = categories.categories;
  }

  get user() {
    return this.currentUser.user;
  }

  get notFlagged() {
    return this.args.problem.status !== 'flagged';
  }
  get writePermissions() {
    return this.permissions.writePermissions(this.args.problem);
  }
  get parentActions() {
    return this.parentView?.actions ?? null;
  }
  get flaggedBy() {
    const flaggedBy = this.args.problem.flagReason?.flaggedBy;
    return flaggedBy ? this.store.findRecord('user', flaggedBy) : '';
  }

  get errors() {
    return this.errorHandling.getErrors(this.errorLabel);
  }

  get errorLabel() {
    return 'problemInfoErrors';
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
    this.errorHandling.removeMessages(this.errorLabel);
  }
  // Empty quill editor .html() property returns <p><br></p>
  // For quill to not be empty, there must either be some text or
  // a student must have uploaded an img so there must be an img tag
  isQuillValid() {
    return !this.isQuillEmpty && !this.isQuillTooLong;
  }

  get keywordSelectOptions() {
    let keywords = this.args.problem.keywords;
    if (!Array.isArray(keywords)) {
      return [];
    }
    return keywords.map((keyword) => ({
      value: keyword,
      label: keyword,
    }));
  }
  get isRecommended() {
    let problem = this.args.problem;
    let recommendedProblems = this.args.recommendedProblems.slice() || [];
    return recommendedProblems.includes(problem);
  }

  createKeywordFilter(keyword) {
    if (!keyword) {
      return false;
    }

    // Grab the element without jQuery
    const selectEl = document.getElementById('select-edit-keywords');
    if (!selectEl || !selectEl.selectize) {
      // Fallback if the element or selectize instance isn't found
      return true;
    }

    // Get the selected items array (strings/IDs)
    const items = selectEl.selectize.items;

    // Lowercase the new keyword
    const keywordLower = keyword.trim().toLowerCase();

    // Convert each selected item to lowercase
    const itemsLower = items.map((item) => item.toLowerCase());

    // Return true if the new keyword does NOT already exist
    return !itemsLower.includes(keywordLower);
  }

  continueEdit() {
    this.showEditWarning = false;
    let problem = this.args.problem;
    this.problemName = problem.title;
    this.problemText = problem.text;
    this.privacySetting = problem.privacySetting;
    this.router.transitionTo('problems.edit', problem.id);
  }

  setStatus() {
    let problem = this.args.problem;
    let accountType = this.user.accountType;
    let privacy = this.privacySetting;
    let originalPrivacy = problem.privacySetting;
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
    const problem = this.args.problem;
    const title = this.problemName.trim();
    let text;
    let isQuillValid;
    const quillContent = document.querySelector('.ql-editor');

    if (quillContent !== undefined) {
      text = quillContent.replace(/["]/g, "'");
      isQuillValid = this.isQuillValid();
    } else {
      text = problem.text;
      isQuillValid = true;
    }
    const privacy = this.privacySetting;
    const additionalInfo = this.additionalInfo;
    const copyright = this.copyrightNotice;
    const sharingAuth = this.sharingAuth;

    const keywords = problem.keywords;
    const initialKeywords = this.initialKeywords;
    const didKeywordsChange = !_isEqual(keywords, initialKeywords);

    const flaggedReason = this.flaggedReason;

    const author = this.author;
    const status = this.generatedStatus;

    if (!title || !isQuillValid || !privacy) {
      this.isMissingRequiredFields = true;
      return;
    } else {
      this.isMissingRequiredFields = false;
    }

    if (privacy !== null) {
      problem.privacySetting = privacy;
    }

    problem.title = title;
    problem.text = text;
    problem.additionalInfo = additionalInfo;
    problem.copyrightNotice = copyright;
    problem.sharingAuth = sharingAuth;
    problem.author = author;
    problem.status = status;
    problem.flagReason = flaggedReason;

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
              problem.image = image;
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
                  // handle success
                  this.router.transitionTo('problems.problem', problem.id);
                })
                .catch((err) => {
                  this.errorHandling.handleErrors(
                    err,
                    this.errorLabel,
                    problem
                  );
                  this.showConfirmModal = false;
                });
            });
          })
          .catch((err) => {
            this.errorHandling.handleErrors(err, this.errorLabel);
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
              problem.image = image;
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
                  this.router.transitionTo('problems.problem', problem.id);
                })
                .catch((err) => {
                  this.errorHandling.handleErrors(
                    err,
                    this.errorLabel,
                    problem
                  );
                  this.showConfirmModal = false;
                });
            });
          })
          .catch((err) => {
            this.errorHandling.handleErrors(err, this.errorLabel);
          });
      }
    } else {
      if (problem.hasDirtyAttributes || didKeywordsChange) {
        problem.modifiedBy = this.user;
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
            this.showConfirmModal = false;
            this.router.transitionTo('problems.problem', problem.id);
          })
          .catch((err) => {
            this.errorHandling.handleErrors(err, this.errorLabel, problem);
            this.showConfirmModal = false;
            return;
          });
      } else {
        this.router.transitionTo('problems.problem', problem.id);
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
          problem.isTrashed = true;
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
                    problem.isTrashed = false;
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
              this.errorHandling.handleErrors(err, this.errorLabel, problem);
            });
        }
      });
  }

  @action editProblem() {
    let problem = this.args.problem;
    let problemId = problem.id;
    let currentUserAccountType = this.user.accountType;
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

    let keywords = problem.keywords || [];

    let keywordsCopy = keywords.slice();
    this.initialKeywords = keywordsCopy;

    if (!problem.isUsed) {
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

  @action
  radioSelect(value) {
    this.privacySetting = value;
  }

  @action
  changePrivacy() {
    const privacySelectEl = document.getElementById('privacy-select');
    const privacy = privacySelectEl ? privacySelectEl.value : '';
    this.privacySettingIcon = privacy;
  }

  @action
  checkPrivacy() {
    const currentPrivacy = this.args.problem.privacySetting;
    const privacySelectEl = document.getElementById('privacy-select');
    const privacy = privacySelectEl ? privacySelectEl.value : '';
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
    let currentUser = this.user;
    let status = this.generatedStatus;
    let problem = this.args.problem;
    let title = this.problemName;
    let flaggedReason = {
      flaggedBy: currentUser.id,
      reason: '',
      flaggedDate: new Date(),
    };

    if (status === 'approved' || status === 'pending') {
      this.flaggedReason = null;
      return this.updateProblem();
    } else if (status === 'flagged' && !problem.flagReason) {
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

  @action
  updateProblemStatus(status) {
    this.problemStatus = status;
  }

  @action
  addToMyProblems() {
    const problemCopy = {
      ...this.args.problem,
      title: `Copy of ${this.args.problem.title}`,
      createdBy: this.user,
      organization: this.user.organization,
      privacySetting: 'M',
      createDate: new Date(),
    };

    let newProblem = this.store.createRecord('problem', problemCopy);

    newProblem
      .save()
      .then((problem) => {
        this.savedProblem = problem;
        this.alert.showToast(
          'success',
          `${problem.title} added to your problems`,
          'bottom-end',
          3000,
          false,
          null
        );
        this.router.transitionTo('problems.problem', problem.id);
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
        this.errorHandling.handleErrors(err, this.errorLabel, problem);
      });
  }

  @action toggleCategories() {
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

  @action toggleAssignment() {
    this.router.transitionTo(
      'problems.problem.assignment',
      this.args.problem.id
    );
    // var scr = $('#outlet')[0].scrollHeight;
    // $('#outlet').animate({ scrollTop: scr }, 100);
  }

  @action hideInfo(doTransition = true) {
    // transition back to list

    const outletEl = document.getElementById('outlet');
    if (outletEl) {
      outletEl.classList.add('hidden');
    }
    if (doTransition) {
      this.router.transitionTo('problems');
    }
  }

  @action checkRecommend() {
    const accountType = this.user.accountType;
    const problem = this.args.problem;
    const privacySetting = problem.privacySetting;
    const status = problem.status;

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
    let accountType = this.user.accountType;
    if (accountType === 'A') {
      let orgList = this.args.orgList.slice();
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
    return this.user.get('organization').then((org) => {
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

  @action
  toggleGeneral() {
    this.showGeneral = true;
    this.showCats = false;
    this.showAdditional = false;
    this.showLegal = false;
  }

  @action
  toggleCats() {
    this.showCats = true;
    this.showGeneral = false;
    this.showAdditional = false;
    this.showLegal = false;
  }

  @action
  toggleAdditional() {
    this.showAdditional = true;
    this.showCats = false;
    this.showGeneral = false;
    this.showLegal = false;
  }

  @action
  toggleLegal() {
    this.showLegal = true;
    this.showCats = false;
    this.showAdditional = false;
    this.showGeneral = false;
  }

  @action
  restoreProblem() {
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
          problem.isTrashed = false;
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
            this.parentActions?.refreshList.call(parentView);
          });
        }
      });
  }

  @action
  toggleShowFlagReason() {
    this.showFlagReason = !this.showFlagReason;
  }
  @action updateKeywords(val, $item) {
    if (!val) {
      return;
    }

    let keywords = this.args.problem.keywords;
    if (!Array.isArray(keywords)) {
      this.args.problem.keywords = [];
      keywords = this.args.problem.keywords;
    }
    let isRemoval = _isNull($item);

    if (isRemoval) {
      keywords.removeObject(val);
      return;
    }
    keywords.addObject(val);
  }
  @action
  updateQuillText(content, isEmpty, isOverLengthLimit) {
    this.quillText = content;
    this.isQuillEmpty = isEmpty;
    this.isQuillTooLong = isOverLengthLimit;
  }
}

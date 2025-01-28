import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import _isEqual from 'lodash/isEqual';
import _isNull from 'lodash/isNull';
import { service } from '@ember/service';

export default class ProblemInfoComponent extends Component {
  @service('sweet-alert') alert;
  @service('problem-permissions') permissions;
  @service('utility-methods') utils;
  @service store;
  @service router;
  @service currentUser;
  @service errorHandling;
  @tracked problem = {};
  @tracked showFlagReason = false;
  @tracked showCategories = false;
  @tracked isWide = false;
  @tracked filesToBeUploaded = null;
  @tracked isMissingRequiredFields = false;

  get tabs() {
    return [
      { label: 'General', key: 'general' },
      { label: 'Categories', key: 'categories' },
      { label: 'Additional', key: 'additional' },
      { label: 'Legal', key: 'legal' },
    ];
  }

  get showGeneral() {
    return this.activeTab === 'general';
  }

  get showCats() {
    return this.activeTab === 'categories';
  }

  get showAdditional() {
    return this.activeTab === 'additional';
  }

  get showLegal() {
    return this.activeTab === 'legal';
  }

  get activeTab() {
    const tabValue = this.args.tab; // could be undefined if no query param
    const validTabs = this.tabs.map((tab) => tab.key);
    if (!validTabs.includes(tabValue)) {
      return 'general';
    }
    return tabValue;
  }

  constructor() {
    super(...arguments);
    const outletEl = document.getElementById('outlet');
    if (outletEl) {
      outletEl.classList.remove('hidden');
    }
    this.loadLocalProblem();
  }

  // use @action to mark that this function is called by a lifecycle hook and ensure that 'this' is the component.
  // updates the local problem object with the properties of the problem passed in as an argument when:
  // a. the component is first rendered
  // b. the problem passed in as an argument changes
  @action
  async loadLocalProblem() {
    this.problem = await this.extractEditableProperties(this.args.problem);
  }

  // Create a local copy of the problem as an object.
  async extractEditableProperties(problem) {
    const categories = await problem.categories; // fully load
    return {
      title: problem.title,
      author: problem.author,
      text: problem.text,
      categories: categories || [],
      status: problem.status,
      privacySetting: problem.privacySetting,
      sharingAuth: problem.sharingAuth,
      additionalInfo: problem.additionalInfo,
      copyrightNotice: problem.copyrightNotice,
      image: problem.image,
      keywords: problem.keywords?.slice() || [],
    };
  }

  get user() {
    return this.currentUser.user;
  }

  get notFlagged() {
    return this.problem.status !== 'flagged';
  }
  get writePermissions() {
    return this.permissions.writePermissions(this.args.problem);
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
    let status = this.problem.status;
    return this.iconFillOptions[status];
  }

  get canEditStatus() {
    return !this.user.isTeacher && this.args.isEditing;
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
    let keywords = this.problem.keywords;
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
    this.router.transitionTo('problems.edit', this.args.problem.id, {
      queryParams: { tab: this.activeTab },
    });
  }

  adjustStatus(originalPrivacy, newPrivacy, accountType) {
    if (originalPrivacy !== newPrivacy) {
      if (accountType === 'A') {
        return this.problem.status;
      } else if (accountType === 'P') {
        if (newPrivacy === 'E') {
          return 'pending';
        } else {
          return this.problem.status;
        }
      } else {
        if (newPrivacy === 'M') {
          return 'approved';
        } else {
          return 'pending';
        }
      }
    } else {
      return this.problem.status;
    }
  }

  @action
  async updateProblem() {
    const isPrivacyOk = await this.checkPrivacy(
      this.args.problem.privacySetting,
      this.problem.privacySetting
    );

    if (!isPrivacyOk) {
      return;
    }

    const currentStatus = this.args.problem.status;
    const newStatus = this.adjustStatus(
      this.args.problem.status,
      this.problem.status,
      this.user.accountType
    );

    if (currentStatus !== 'flagged' && newStatus === 'flagged') {
      const { isStatusOk, flaggedReason } = await this.handleFlaggedStatus();
      if (!isStatusOk) {
        return;
      }
      this.problem.flagReason = flaggedReason;
    } else {
      this.problem.flagReason = null;
    }

    // adjust properties of the local copy of the problem
    this.problem.title = this.problem.title.trim();

    this.problem.text = (this.problem.text || '').replace(/["]/g, "'");

    if (
      !this.problem.title ||
      !this.isQuillValid ||
      !this.problem.privacySetting
    ) {
      this.isMissingRequiredFields = true;
      return;
    } else {
      this.isMissingRequiredFields = false;
    }

    const uploadResults = this.filesToBeUploaded
      ? await this.uploadFiles(this.filesToBeUploaded)
      : null;

    if (uploadResults) {
      const image = await this.store.findRecord('image', uploadResults[0]._id);
      this.problem.image = image;
    }

    if (
      !_isEqual(this.problem, this.args.problem) ||
      !_isEqual(this.problem.keywords, this.args.problem.keywords) ||
      !_isEqual(
        this.problem.categories.slice(),
        this.args.problem.categories.slice()
      )
    ) {
      // update problem with the values from the local copy
      Object.keys(this.problem).forEach((key) => {
        this.args.problem.set(key, this.problem[key]);
      });
      this.args.problem
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
          this.showConfirmModal = false;
          this.router.transitionTo('problems.problem', this.args.problem.id, {
            queryParams: { tab: this.activeTab },
          });
        })
        .catch((err) => {
          this.errorHandling.handleErrors(
            err,
            this.errorLabel,
            this.args.problem
          );
          this.showConfirmModal = false;
        });
    }
  }

  uploadFiles(filesToBeUploaded = []) {
    const formData = new FormData();
    filesToBeUploaded.forEach((f) => {
      formData.append('photo', f);
    });

    const isPDF = filesToBeUploaded[0].type === 'application/pdf';
    const url = isPDF ? '/pdf' : '/image';
    return fetch(url, {
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
        return res.images;
      })
      .catch((err) => {
        this.errorHandling.handleErrors(err, this.errorLabel);
      });
  }

  @action
  handleChange(property, value) {
    this.problem = { ...this.problem, [property]: value };
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
    let isAdmin = this.user.isAdmin;

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
  onSelectTab(tab) {
    // this.activeTab = tab;
    this.router.transitionTo({
      queryParams: { tab },
    });
  }

  @action
  changePrivacy(event) {
    const newPrivacy = event.target.value;
    this.problem = { ...this.problem, privacySetting: newPrivacy };
  }

  async checkPrivacy(currentPrivacy, newPrivacy) {
    if (currentPrivacy !== 'E' && newPrivacy === 'E') {
      const response = await this.alert.showModal(
        'question',
        'Are you sure you want to make your problem public?',
        "You are changing your problem's privacy status to public. This means it will be accessible to all EnCoMPASS users. You will not be able to make any changes to this problem once it has been used",
        'Yes'
      );
      return response.value;
    } else {
      return true;
    }
  }

  async handleFlaggedStatus() {
    const flaggedReason = {
      flaggedBy: this.user,
      reason: '',
      flaggedDate: new Date(),
    };

    const { value: isStatusOk } = await this.alert.showModal(
      'warning',
      `Are you sure you want to mark ${this.problem.title} as flagged`,
      null,
      `Yes, Flag it!`
    );

    if (!isStatusOk) {
      return { isStatusOk: false, flaggedReason: null };
    }

    const { value: reason } = await this.alert.showPromptSelect(
      'Flag Reason',
      this.flagOptions,
      'Select a reason'
    );

    flaggedReason.reason = reason;

    if (reason === 'other') {
      const { value: other } = this.alert.showPrompt(
        'text',
        'Other Flag Reason',
        'Please provide a brief explanation for why this problem should be flagged.',
        'Flag'
      );
      flaggedReason.reason = other;
    }
    return { isStatusOk: true, flaggedReason };
  }

  // this function is used when we aren't editing, so it's appropriate that we reference this.args.problem.
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

    const newProblem = this.store.createRecord('problem', problemCopy);

    newProblem
      .save()
      .then((problem) => {
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

  @action
  toggleImageSize() {
    this.isWide = !this.isWide;
  }

  @action
  deleteImage() {
    this.problem = { ...this.problem, image: null };
  }

  @action
  addCategory(category) {
    const categories = this.problem.categories;
    if (category && !categories.includes(category)) {
      categories.pushObject(category);
    }
  }

  @action
  removeCategory(category) {
    this.problem.categories.removeObject(category);
  }

  @action
  toggleAssignment() {
    this.router.transitionTo(
      'problems.problem.assignment',
      this.args.problem.id
    );
  }

  @action
  hideInfo() {
    // transition back to list
    const outletEl = document.getElementById('outlet');
    if (outletEl) {
      outletEl.classList.add('hidden');
    }
    this.router.transitionTo('problems');
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
          });
        }
      });
  }

  @action
  toggleCategories() {
    this.showCategories = !this.showCategories;
  }

  @action
  toggleShowFlagReason() {
    this.showFlagReason = !this.showFlagReason;
  }
  @action
  updateKeywords(val, $item) {
    if (!val) {
      return;
    }

    const isRemoval = _isNull($item);

    if (isRemoval) {
      const keywords = this.problem.keywords.filter(
        (keyword) => keyword !== val
      );
      this.problem = { ...this.problem, keywords };
    } else {
      this.problem = {
        ...this.problem,
        keywords: [...this.problem.keywords, val],
      };
    }
  }

  @action
  updateQuillText(text, isEmpty, isOverLengthLimit) {
    this.isQuillEmpty = isEmpty;
    this.isQuillTooLong = isOverLengthLimit;
    this.problem = { ...this.problem, text };
  }
}

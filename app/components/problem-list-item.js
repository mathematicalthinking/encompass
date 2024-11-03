import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

const ACTION_BUTTONS = {
  Restore: (problem) => () => this.restoreProblem(problem),
  Flag: (problem) => () =>
    this.confirmStatusUpdate(problem, 'title', 'flagged'),
  Approve: (problem) => () =>
    this.confirmStatusUpdate(problem, 'title', 'approved'),
  Assign: (problem) => () => this.assignProblem(problem),
  Copy: (problem) => () => this.addToMyProblems(problem),
};

export default class ProblemListItemComponent extends Component {
  @service('sweet-alert') alert;
  @service('problem-permissions') permissions;
  @service router;
  @service store;

  @tracked showAdminStatusMenu = false;
  @tracked showMoreMenu = false;
  @tracked savedProblem = null;

  moreMenuOptions = [
    {
      label: 'Edit',
      value: 'edit',
      action: 'editProblem',
      icon: 'far fa-edit',
    },
    {
      label: 'Assign',
      value: 'assign',
      action: 'assignProblem',
      icon: 'fas fa-list-ul',
    },
    {
      label: 'Pending',
      value: 'pending',
      action: 'makePending',
      icon: 'far fa-clock',
      adminOnly: true,
    },
    {
      label: 'Report',
      value: 'flag',
      action: 'reportProblem',
      icon: 'fas fa-exclamation-circle',
    },
    {
      label: 'Delete',
      value: 'delete',
      action: 'deleteProblem',
      icon: 'fas fa-trash',
    },
  ];

  get isAdminUser() {
    return this.args.currentUser.isAdmin;
  }

  get isPdAdminUser() {
    return this.args.currentUser.isPdAdmin;
  }

  get actionButtonName() {
    const problem = this.args.problem;

    if (this.isAdminUser) {
      if (problem.isTrashed) {
        return 'Restore';
      } else if (problem.status === 'approved') {
        return 'Flag';
      } else {
        return 'Approve';
      }
    }

    if (this.isPdAdminUser) {
      if (problem.privacySetting !== 'E' && problem.status !== 'approved') {
        return 'Approve';
      } else if (problem.status !== 'flagged') {
        return 'Assign';
      } else {
        return 'Copy';
      }
    }

    return 'Assign';
  }

  @action
  handleActionButton() {
    const actionName = this.actionButtonName;
    const problem = this.args.problem;
    const actionFunction = ACTION_BUTTONS[actionName](problem);

    actionFunction.call(this); // Use `call` to ensure `this` refers to the component
  }

  get privacySetting() {
    return this.args.problem.privacySetting;
  }
  get puzzleId() {
    return this.args.problem.puzzleId;
  }

  get writePermissions() {
    return this.permissions.writePermissions(this.args.problem);
  }
  iconFillOptions = {
    approved: '#35A853',
    pending: '#FFD204',
    flagged: '#EB5757',
  };
  flagOptions = {
    inappropiate: 'Inappropriate Content',
    ip: 'Intellectual Property Concern',
    substance: 'Lacking Substance',
    other: 'Other Reason',
  };

  get isPublic() {
    return this.privacySetting === 'E';
  }

  get isOrg() {
    return this.privacySetting === 'O';
  }

  get isPrivate() {
    return this.privacySetting === 'M';
  }

  get isPows() {
    return this.puzzleId !== null && this.puzzleId !== undefined;
  }

  get statusIconFill() {
    let status = this.args.problem.status;

    return this.iconFillOptions[status];
  }

  get isRecommended() {
    let problem = this.args.problem;
    let recommendedProblems = this.args.recommendedProblems || [];
    if (recommendedProblems.includes(problem)) {
      return true;
    } else {
      return false;
    }
  }

  get ellipsisMenuOptions() {
    let { canDelete, canAssign } = this.writePermissions;
    let moreMenuOptions = this.moreMenuOptions.slice();
    let isAdmin = this.isAdminUser;
    let { status, isTrashed: deleted } = this.args.problem;
    let options = moreMenuOptions.slice();

    if (!canDelete) {
      // Remove 'edit' and 'delete' options if the user cannot delete
      options = options.filter(
        (option) => option.value !== 'edit' && option.value !== 'delete'
      );
    }

    if (isAdmin) {
      // If problem is approved, admins will have an exposed Flag button, so no need in more menu
      if (canAssign) {
        options = options.filter((option) => option.value !== 'flag');
      } else {
        options = options.filter((option) => option.value !== 'assign');
      }
    }

    if (!isAdmin) {
      // Remove admin-only options for non-admins
      options = options.filter((option) => !option.adminOnly);

      if (status === 'approved') {
        options = options.filter((option) => option.value !== 'assign');
      }
    }

    if (status === 'pending') {
      // Don't show 'pending' or 'assign' options if status is pending
      options = options.filter(
        (option) => option.value !== 'pending' && option.value !== 'assign'
      );
    }

    if (status === 'flagged') {
      // Don't show 'flag' or 'assign' options if status is flagged
      options = options.filter(
        (option) => option.value !== 'flag' && option.value !== 'assign'
      );
    }

    if (deleted) {
      // Don't show 'delete' option if the problem is deleted
      options = options.filter((option) => option.value !== 'delete');
    }

    return options;
  }

  get actionButton() {
    let actionBtn = {};
    let isAdmin = this.args.currentUser.isAdmin;
    let isPdAdmin = this.args.currentUser.isPdAdmin;
    let problem = this.args.problem;

    if (isAdmin) {
      if (problem.isTrashed) {
        actionBtn.function = 'restoreProblem';
        actionBtn.name = 'Restore';
      } else {
        actionBtn.function = 'confirmStatusUpdate';
        if (problem.get('status') === 'approved') {
          actionBtn.name = 'Flag';
          actionBtn.argument1 = 'title';
          actionBtn.argument2 = 'flagged';
        } else {
          actionBtn.name = 'Approve';
          actionBtn.argument1 = 'title';
          actionBtn.argument2 = 'approved';
        }
      }
    } else {
      if (isPdAdmin) {
        if (
          problem.get('privacySetting') !== 'E' &&
          problem.get('status') !== 'approved'
        ) {
          actionBtn.function = 'confirmStatusUpdate';
          actionBtn.name = 'Approve';
          actionBtn.argument1 = 'title';
          actionBtn.argument2 = 'approved';
        } else {
          if (problem.get('status') !== 'flagged') {
            actionBtn.function = 'assignProblem';
            actionBtn.name = 'Assign';
          } else {
            actionBtn.function = 'addToMyProblems';
            actionBtn.name = 'Copy';
          }
        }
      } else {
        actionBtn.function = 'assignProblem';
        actionBtn.name = 'Assign';
      }
    }
    return actionBtn;
  }

  @action showStatusOptions() {
    this.showAdminStatusMenu = true;
  }
  @action toggleShowMoreMenu() {
    let isShowing = this.showMoreMenu;
    this.showMoreMenu = !isShowing;
  }
  @action confirmStatusUpdate(record, displayKey, value) {
    let action;
    let display;
    if (value === 'approved') {
      action = 'approve it';
    } else if (value === 'flagged') {
      action = 'flag it';
    } else {
      action = 'mark as pending';
    }
    display = record.get(displayKey);
    this.alert
      .showModal(
        'warning',
        `Are you sure you want to mark ${display} as ${value}`,
        null,
        `Yes, ${action}`
      )
      .then((result) => {
        if (result.value) {
          if (value === 'flagged') {
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
                          this.updateStatus(
                            record,
                            value,
                            displayKey,
                            result.value
                          );
                        }
                      });
                  } else {
                    this.updateStatus(record, value, displayKey, result.value);
                  }
                }
              });
          } else {
            this.updateStatus(record, value, displayKey);
          }
        }
      });
  }
  @action updateStatus(record, value, displayKey, reason) {
    let msg;
    let display = record.get(displayKey);
    if (value === 'flagged' || value === 'approved') {
      msg = `${display} ${value}`;
    } else if (value === 'pending') {
      msg = `${display} marked as ${value}`;
    }
    if (value === 'approved') {
      record.set('flagReason', null);
    }
    record.set('status', value);
    if (reason) {
      let flagReason = {
        flaggedBy: this.args.currentUser.id,
        reason: reason,
        flaggedDate: new Date(),
      };
      record.set('flagReason', flagReason);
    }
    record
      .save()
      .then((record) => {
        this.alert.showToast('success', msg, 'bottom-end', 5000, false, null);
        if (this.showMoreMenu) {
          this.showMoreMenu = false;
        }
      })
      .catch((err) => {
        let message = err.errors[0].detail;
        this.alert.showToast(
          'error',
          `${message}`,
          'bottom-end',
          4000,
          false,
          null
        );
        this.handleErrors(err, 'flagErrors', record);
      });
  }
  @action reportProblem() {
    this.confirmStatusUpdate(this.args.problem, 'title', 'flagged');
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
            this.args.refreshList();
          });
        }
      });
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
          problem.set('isTrashed', true);
          // this.sendAction('toProblemList');
          problem
            .save()
            .then((problem) => {
              if (this.showMoreMenu) {
                this.showMoreMenu = false;
              }
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
                      // window.history.back();
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
  @action assignProblem() {
    // this.set('creatingAssignment', true);
    // send to parent to handle?
    let problem = this.args.problem;
    problem.set('isForAssignment', true);
    this.router.transitionTo('problems.problem', problem.id);
  }
  @action editProblem() {
    // send to parent to handle?
    let problem = this.args.problem;
    problem.set('isForEdit', true);
    this.router.transitionTo('problems.problem', problem.id);
  }

  @action addToMyProblems() {
    let problem = this.args.problem;
    let originalTitle = problem.title;
    let title = 'Copy of ' + originalTitle;
    let text = problem.text;
    let author = problem.author;
    let additionalInfo = problem.additionalInfo;
    let isPublic = problem.isPublic;
    let image = problem.image;
    let imageUrl = problem.imageUrl;
    let createdBy = this.args.currentUser;
    let categories = problem.categories;
    let status = problem.status;
    let currentUser = this.args.currentUser;
    let keywords = problem.keywords;
    let organization = currentUser.get('organization');
    let copyright = problem.copyrightNotice;
    let sharingAuth = problem.sharingAuth;

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
        this.avedProblem = problem;
        this.alert.showToast(
          'success',
          `${name} added to your problems`,
          'bottom-end',
          3000,
          false,
          null
        );
        this.args.refreshList();
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

  @action toProblemInfo(problem) {
    this.router.transitionTo('problems.problem', problem.id);
  }
  @action makePending() {
    this.confirmStatusUpdate(this.args.problem, 'title', 'pending');
  }
}

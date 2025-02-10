import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

const ACTION_BUTTONS = {
  Restore: (problem) => () => this.restoreProblem(problem),
  Flag: (problem) => () =>
    this.confirmStatusUpdate(problem, 'title', 'flagged'),
  Approve: (problem) => () =>
    this.confirmStatusUpdate(problem, 'title', 'approved'),
  Assign: (problem) => () => this.assignProblem(problem),
  Copy: (problem) => () => this.addToMyProblems(problem),
  Delete: (problem) => () => this.deleteProblem(problem),
};

export default class ProblemListItemComponent extends Component {
  @service('sweet-alert') alert;
  @service('problem-permissions') permissions;
  @service currentUser;
  @service problemUtils;
  @service router;
  @service store;

  @tracked showAdminStatusMenu = false;
  @tracked showMoreMenu = false;
  @tracked savedProblem = null;

  moreMenuOptions = [
    {
      label: 'Edit',
      value: 'edit',
      action: this.editProblem,
      icon: 'far fa-edit',
    },
    {
      label: 'Assign',
      value: 'assign',
      action: this.assignProblem,
      icon: 'fas fa-list-ul',
    },
    {
      label: 'Pending',
      value: 'pending',
      action: this.makePending,
      icon: 'far fa-clock',
      adminOnly: true,
    },
    {
      label: 'Report',
      value: 'flag',
      action: this.reportProblem,
      icon: 'fas fa-exclamation-circle',
    },
    {
      label: 'Delete',
      value: 'delete',
      action: this.deleteProblem,
      icon: 'fas fa-trash',
    },
  ];

  get isAdminUser() {
    return this.currentUser.isAdmin;
  }

  get isPdAdminUser() {
    return this.currentUser.isPdAdmin;
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
    const actionBtn = {};
    const problem = this.args.problem;

    if (this.isAdmin) {
      if (problem.isTrashed) {
        actionBtn.function = 'restoreProblem';
        actionBtn.name = 'Restore';
      } else {
        actionBtn.function = 'confirmStatusUpdate';
        if (problem.status === 'approved') {
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
      if (this.isPdAdmin) {
        if (problem.privacySetting !== 'E' && problem.status !== 'approved') {
          actionBtn.function = 'confirmStatusUpdate';
          actionBtn.name = 'Approve';
          actionBtn.argument1 = 'title';
          actionBtn.argument2 = 'approved';
        } else {
          if (problem.status !== 'flagged') {
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
        flaggedBy: this.currentUser.id,
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
                    });
                  }
                });
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
      });
  }
  @action assignProblem() {
    this.router.transitionTo(
      'problems.problem.assignment',
      this.args.problem.id
    );
  }
  @action editProblem() {
    this.router.transitionTo('problems.edit', this.args.problem.id);
  }

  @action addToMyProblems() {
    const copyProperties = {
      title: `Copy of ${this.args.problem.title}`,
      createdBy: this.user,
      organization: this.user.organization,
      privacySetting: 'M',
      createDate: new Date(),
    };

    this.problemUtils
      .saveCopy(this.args.problem, copyProperties)
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
      });
  }

  @action makePending() {
    this.confirmStatusUpdate(this.args.problem, 'title', 'pending');
  }
}

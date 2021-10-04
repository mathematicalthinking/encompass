import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import _ from 'underscore';
import { inject as service } from '@ember/service';

export default class ProblemListItemComponent extends Component {
  @tracked showAdminStatusMenu = false;
  @tracked showMoreMenu = false;
  @tracked savedProblem = null;
  get privacySetting() {
    return this.args.problem.privacySetting;
  }
  get puzzleId() {
    return this.args.problem.puzzleId;
  }
  @service('sweet-alert') alert;
  @service('problem-permissions') permissions;
  @service router;
  @service store;
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
    let canDelete = this.writePermissions.canDelete;
    let canAssign = this.writePermissions.canAssign;
    let moreMenuOptions = this.args.moreMenuOptions;
    let isAdmin = this.args.currentUser.isAdmin;
    let options = moreMenuOptions.slice();
    let status = this.args.problem.status;
    let deleted = this.args.problem.isTrashed;

    if (!canDelete) {
      // dont show delete or edit option
      options = _.filter(moreMenuOptions, (option) => {
        return option.value !== 'edit' && option.value !== 'delete';
      });
    }

    if (isAdmin) {
      // if problem is approved, admins will have exposed Flag button so no need in more menu
      if (canAssign) {
        options = _.filter(options, (option) => {
          return !_.contains(['flag'], option.value);
        });
      } else {
        options = _.filter(options, (option) => {
          return !_.contains(['assign'], option.value);
        });
      }
    }

    if (!isAdmin) {
      // remove any admin only options for non admins
      options = _.filter(options, (option) => {
        return !option.adminOnly;
      });
      if (status === 'approved') {
        options = _.filter(options, (option) => {
          return !_.contains(['assign'], option.value);
        });
      }
    }
    if (status === 'pending') {
      // dont show pend or assign option if status is pending
      options = _.filter(options, (option) => {
        return !_.contains(['pending', 'assign'], option.value);
      });
    }

    if (status === 'flagged') {
      // dont show flag or assign if status is flagged
      options = _.filter(options, (option) => {
        return !_.contains(['flag', 'assign'], option.value);
      });
    }

    if (deleted) {
      options = _.filter(options, (option) => {
        return !_.contains(['delete'], option.value);
      });
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

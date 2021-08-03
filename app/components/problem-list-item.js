import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
/*global _:false */
import { inject as service } from '@ember/service';
import _ from 'underscore';

export default Component.extend({
  classNames: ['problem-list-item'],
  classNameBindings: ['isPublic', 'isPrivate', 'isOrg', 'isPows'],
  privacySetting: alias('problem.privacySetting'),
  puzzleId: alias('problem.puzzleId'),
  alert: service('sweet-alert'),
  permissions: service('problem-permissions'),
  canEdit: alias('writePermissions.canEdit'),
  canDelete: alias('writePermissions.canDelete'),
  canAssign: alias('writePermissions.canAssign'),
  recommendedProblems: alias('currentUser.organization.recommendedProblems'),
  iconFillOptions: {
    approved: '#35A853',
    pending: '#FFD204',
    flagged: '#EB5757',
  },
  flagOptions: {
    inappropiate: 'Inappropriate Content',
    ip: 'Intellectual Property Concern',
    substance: 'Lacking Substance',
    other: 'Other Reason',
  },

  didReceiveAttrs: function () {
    let problem = this.problem;
    this.set('writePermissions', this.permissions.writePermissions(problem));
  },

  isPublic: computed('problem.privacySetting', function () {
    return this.privacySetting === 'E';
  }),

  isOrg: computed('problem.privacySetting', function () {
    return this.privacySetting === 'O';
  }),

  isPrivate: computed('problem.privacySetting', function () {
    return this.privacySetting === 'M';
  }),

  isPows: computed('problem.puzzleId', function () {
    return this.puzzleId !== null && this.puzzleId !== undefined;
  }),

  statusIconFill: computed('problem.status', function () {
    let status = this.problem.status;

    return this.iconFillOptions[status];
  }),

  isRecommended: computed('problem.id', 'recommendedProblems.[]', function () {
    let problem = this.problem;
    let recommendedProblems = this.recommendedProblems || [];
    if (recommendedProblems.includes(problem)) {
      return true;
    } else {
      return false;
    }
  }),

  ellipsisMenuOptions: computed('problem.id', 'problem.status', function () {
    let canDelete = this.canDelete;
    let canAssign = this.canAssign;
    let moreMenuOptions = this.moreMenuOptions;
    let isAdmin = this.currentUser.isAdmin;
    let options = moreMenuOptions.slice();
    let status = this.problem.status;
    let deleted = this.problem.isTrashed;

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
  }),

  actionButton: computed(
    'problem.isTrashed',
    'problem.status',
    'problem.privacySetting',
    function () {
      let actionBtn = {};
      let isAdmin = this.currentUser.isAdmin;
      let isPdAdmin = this.currentUser.isPdAdmin;
      let problem = this.problem;

      if (isAdmin) {
        if (problem.get('isTrashed')) {
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
  ),

  actions: {
    showStatusOptions() {
      this.set('showAdminStatusMenu', true);
    },
    toggleShowMoreMenu() {
      let isShowing = this.showMoreMenu;
      this.set('showMoreMenu', !isShowing);
    },
    confirmStatusUpdate(record, displayKey, value) {
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
                            this.send(
                              'updateStatus',
                              record,
                              value,
                              displayKey,
                              result.value
                            );
                          }
                        });
                    } else {
                      this.send(
                        'updateStatus',
                        record,
                        value,
                        displayKey,
                        result.value
                      );
                    }
                  }
                });
            } else {
              this.send('updateStatus', record, value, displayKey);
            }
          }
        });
    },
    updateStatus(record, value, displayKey, reason) {
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
            this.set('showMoreMenu', false);
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
    },
    reportProblem() {
      this.send('confirmStatusUpdate', this.problem, 'title', 'flagged');
    },
    restoreProblem: function () {
      let problem = this.problem;
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
              this.refreshList();
            });
          }
        });
    },
    deleteProblem: function () {
      let problem = this.problem;
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
                  this.set('showMoreMenu', false);
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
    },
    assignProblem() {
      // this.set('creatingAssignment', true);
      // send to parent to handle?
      let problem = this.problem;
      problem.set('isForAssignment', true);
      this.send('toProblemInfo', problem);
    },
    editProblem() {
      // send to parent to handle?
      let problem = this.problem;
      problem.set('isForEdit', true);
      this.send('toProblemInfo', problem);
    },

    addToMyProblems: function () {
      let problem = this.problem;
      let originalTitle = problem.get('title');
      let title = 'Copy of ' + originalTitle;
      let text = problem.get('text');
      let author = problem.get('author');
      let additionalInfo = problem.get('additionalInfo');
      let isPublic = problem.get('isPublic');
      let image = problem.get('image');
      let imageUrl = problem.get('imageUrl');
      let createdBy = this.currentUser;
      let categories = problem.get('categories');
      let status = problem.get('status');
      let currentUser = this.currentUser;
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
          this.set('savedProblem', problem);
          this.alert.showToast(
            'success',
            `${name} added to your problems`,
            'bottom-end',
            3000,
            false,
            null
          );
          this.refreshList();
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
    },

    toProblemInfo(problem) {
      this.toProblemInfo(problem);
    },
    makePending() {
      this.send('confirmStatusUpdate', this.problem, 'title', 'pending');
    },
  },
});

Encompass.ProblemListItemComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  classNames: ['problem-list-item'],
  classNameBindings: ['isPublic', 'isPrivate', 'isOrg', 'isPows'],
  privacySetting: Ember.computed.alias('problem.privacySetting'),
  puzzleId: Ember.computed.alias('problem.puzzleId'),
  alert: Ember.inject.service('sweet-alert'),
  iconFillOptions: {
    approved: '#35A853',
    pending: '#FFD204',
    flagged: '#EB5757'
  },
  flagOptions: {
    'inappropiate': 'Inappropriate Content',
    'ip': 'Intellectual Property Concern',
    'substance': 'Lacking Substance',
    'other': 'Other Reason'
  },

  isPublic: function() {
    return this.get('privacySetting') === 'E';
  }.property('problem.privacySetting'),

  isOrg: function() {
    return this.get('privacySetting') === 'O';
  }.property('problem.privacySetting'),

  isPrivate: function() {
    return this.get('privacySetting') === 'M';
  }.property('problem.privacySetting'),

  isPows: function() {
    return this.get('puzzleId') !== null && this.get('puzzleId') !== undefined;
  }.property('problem.puzzleId'),

  statusIconFill: function() {
    let status = this.get('problem.status');

    return this.get('iconFillOptions')[status];
  }.property('problem.status'),

  canDelete: Ember.computed('problem.id', function () {
    let problem = this.get('problem');
    let currentUser = this.get('currentUser');
    let currentUserType = currentUser.get('accountType');
    let creator = problem.get('createdBy.content.id');
    let canDelete;

    if (currentUserType === "A") {
      canDelete = true;
    } else if (currentUserType === "P") {
      if (problem.get('privacySetting') === "O" || creator === currentUser.id) {
        canDelete = true;
      }
    } else if (currentUserType === "T") {
      if (problem.get('privacySetting') === "M") {
        canDelete = true;
      }
    } else {
      canDelete = false;
    }
    return canDelete;
  }),

  ellipsisMenuOptions: function() {
    let canDelete = this.get('canDelete');
    let moreMenuOptions = this.get('moreMenuOptions');
    let isAdmin = this.get('currentUser.isAdmin');
    let options = moreMenuOptions.slice();
    let status = this.get('problem.status');

    if (!canDelete) {
      // dont show delete or edit option
      options = _.filter(moreMenuOptions, (option) => {
        return option.value !== 'edit' && option.value !== 'delete';
      });
    }

    if (isAdmin) {
      // if problem is approved, admins will have exposed Flag button so no need in more menu
      options = _.filter(options, (option) => {
        return !_.contains(['flag'], option.value);
      });
    }

    if (!isAdmin) {
      // remove any admin only options for non admins
      options = _.filter(options, (option) => {
        return !option.adminOnly;
      });
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

    return options;
  }.property('problem.id', 'problem.status'),


  actions: {
    showStatusOptions() {
      this.set('showAdminStatusMenu', true);
    },
    toggleShowMoreMenu() {
      let isShowing = this.get('showMoreMenu');
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
      this.get('alert').showModal('warning', `Are you sure you want to mark ${display} as ${value}`, null, `Yes, ${action}`)
      .then((result) => {
        if (result.value) {
          if (value === 'flagged') {
            this.get('alert').showPromptSelect('Flag Reason', this.get('flagOptions'), 'Select a reason')
            .then((result) => {
              if (result.value) {
                if (result.value === 'other') {
                  this.get('alert').showPrompt('text', 'Other Flag Reason', 'Please provide a brief explanation for why this problem should be flagged.', 'Flag')
                  .then((result) => {
                    if (result.value) {
                      this.send('updateStatus', record, value, displayKey, result.value);

                    }
                  });
                } else {
                  this.send('updateStatus', record, value, displayKey);
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
        record.set('flagReason', reason);
      }
      record.save()
      .then((record) => {
        this.get('alert').showToast('success', msg, 'bottom-end', 5000, false, null);
        if (this.get('showMoreMenu')) {
          this.set('showMoreMenu', false);
        }
      })
      .catch((err) => {
        let message = err.errors[0].detail;
          this.get('alert').showToast('error', `${message}`, 'bottom-end', 4000, false, null);
          this.handleErrors(err, 'flagErrors', record);
      });

    },
    reportProblem() {
      this.send('confirmStatusUpdate', this.get('problem'), 'title', 'flagged');
    },
    deleteProblem: function () {
      let problem = this.get('problem');
      this.get('alert').showModal('warning', 'Are you sure you want to delete this problem?', null, 'Yes, delete it')
      .then((result) => {
        if (result.value) {
          problem.set('isTrashed', true);
          // this.sendAction('toProblemList');
          problem.save().then((problem) => {
            if (this.get('showMoreMenu')) {
              this.set('showMoreMenu', false);
            }
            this.get('alert').showToast('success', 'Problem Deleted', 'bottom-end', 5000, true, 'Undo')
            .then((result) => {
              if (result.value) {
                problem.set('isTrashed', false);
                problem.save().then(() => {
                  this.get('alert').showToast('success', 'Problem Restored', 'bottom-end', 3000, false, null);
                  // window.history.back();
                });
              }
            });
          }).catch((err) => {
            this.handleErrors(err, 'updateProblemErrors', problem);
          });
        }
      });
    },
    assignProblem() {
      // this.set('creatingAssignment', true);
      // send to parent to handle?
      let problem = this.get('problem');
      problem.set('isForAssignment', true);
      this.send('toProblemInfo', problem);

    },
    editProblem() {
      // send to parent to handle?
      let problem = this.get('problem');
      problem.set('isForEdit', true);
      this.send('toProblemInfo', problem);
    },

    addToMyProblems: function () {
      let problem = this.get('problem');
      let originalTitle = problem.get('title');
      let title = 'Copy of ' + originalTitle;
      let text = problem.get('text');
      let additionalInfo = problem.get('additionalInfo');
      let isPublic = problem.get('isPublic');
      let image = problem.get('image');
      let imageUrl = problem.get('imageUrl');
      let createdBy = this.get('currentUser');
      let categories = problem.get('categories');
      let status = problem.get('status');
      let currentUser = this.get('currentUser');
      let organization = currentUser.get('organization');

      let newProblem = this.store.createRecord('problem', {
        title: title,
        text: text,
        additionalInfo: additionalInfo,
        imageUrl: imageUrl,
        isPublic: isPublic,
        origin: problem,
        categories: categories,
        createdBy: createdBy,
        image: image,
        organization: organization,
        privacySetting: "M",
        status: status,
        createDate: new Date()
      });

      newProblem.save()
        .then((problem) => {
          let name = problem.get('title');
          this.set('savedProblem', problem);
          this.get('alert').showToast('success', `${name} added to your problems`, 'bottom-end', 3000, false, null);
        }).catch((err) => {
          console.log('err is', err);
          this.get('alert').showToast('error', `${err}`, 'bottom-end', 3000, false, null);
          // this.handleErrors(err, 'createRecordErrors', newProblem);
        });
    },

    toProblemInfo(problem) {
      this.get('toProblemInfo')(problem);
    },
    makePending() {
      this.send('confirmStatusUpdate', this.get('problem'), 'title', 'pending');
    }
  }


});
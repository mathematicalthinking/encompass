Encompass.AssignmentInfoTeacherComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, Encompass.AddableProblemsMixin, {
  formattedDueDate: null,
  formattedAssignedDate: null,
  isEditing: false,
  isDisplaying: Ember.computed.not('isEditing'),
  showReport: false,
  isPreparingReport: false,
  htmlDateFormat: 'MM/DD/YYYY',
  displayDateFormat: "MMM Do YYYY",
  assignmentToDelete: null,
  dataFetchErrors: [],
  findRecordErrors: [],
  updateRecordErrors: [],
  alert: Ember.inject.service('sweet-alert'),
  permissions: Ember.inject.service('assignment-permissions'),

  init: function() {
    this._super(...arguments);
    // get all sections and problems
    // only need to get these on init because user won't be creating new sections or problems from this component
    return this.store.findAll('section')
      .then((sections) => {
        this.set('sections', sections);
      })
      .catch((err) => {
        this.handleErrors(err, 'dataFetchErrors');
      });
  },

  didReceiveAttrs: function() {
    const assignment = this.get('assignment');

    if (this.get('currentAssignment.id') !== this.get('assignment.id')) {
      this.set('currentAssignment', assignment);

      this.set('isEditing', false);
      this.setAddProblemFunction('addProblemTypeahead');

      if (this.get('showReport')) {
        this.set('showReport', false);
      }

      let dateFormat = this.get('htmlDateFormat');
      let dueDate = this.assignment.get('dueDate');
      let assignedDate = this.assignment.get('assignedDate');
      this.set('selectedProblem', assignment.get('problem.content'));
      this.set('selectedSection', assignment.get('section.content'));

      this.set('assignmentName', assignment.get('name'));
      this.set('formattedDueDate', moment(dueDate).format(dateFormat));
      this.set('formattedAssignedDate', moment(assignedDate).format(dateFormat));

    }

    if (this.get('studentList') && this.get('assignmentAnswers')) {
      this.prepReport();
    }
  },

  prepReport() {
    this.set('isPreparingReport', true);
    if (!this.get('studentList') || !this.get('assignmentAnswers')) {
      this.set('isPreparingReport', false);
      return;
    }
    let sortedAnswers = this.get('assignmentAnswers').sortBy('createdBy.username');
    this.set('sortedAnswers', sortedAnswers);

    this.get('studentList').forEach((student) => {
      let ownFiltered = sortedAnswers.filterBy('createdBy.username', student.get('username'));
      let sortedByDate = ownFiltered.sortBy('createDate').reverse();
      student.set('filteredAnswers', sortedByDate);
    });
    this.set('isPreparingReport', false);
    this.set('showReport', true);
  },

  isYourOwn: function() {
   return this.get('currentUser.id') === this.get('assignment.createdBy.id');
  }.property('assignment.id', 'currentUser'),

  isDirty: function() {
    const answers = this.get('sortedAnswers');
    return !Ember.isEmpty(answers);
  }.property('sortedAnswers.[]'),

  isClean: Ember.computed.not('isDirty'),

  canDelete: function() {
    return this.get('permissions').canDelete(this.get('assignment'));
  }.property('currentUser.actingRole', 'assignment.answers[]'),

  canEdit: function() {
    const isAdmin = this.get('currentUser.isAdmin');
    const isClean = this.get('isClean');
    const isYourOwn = this.get('isYourOwn');

    return isAdmin || (isClean && isYourOwn);
  }.property('isClean', 'isYourOwn'),
  isReadOnly: Ember.computed.not('canEdit'),

  canEditDueDate: function() {
    return this.get('permissions').canEditDueDate(this.get('assignment'));
  }.property('assignment', 'currentUser.actingRole'),

  canEditAssignedDate: function() {
    return this.get('permissions').canEditAssignedDate(this.get('assignment'));
  }.property('assignment.assignedDate'),

  canEditProblem: function() {
    return this.get('permissions').canEditProblem(this.get('assignment'));
  }.property('assignment.answers.[]'),

  hasBasicEditPrivileges: function() {
    return this.get('permissions').getPermissionsLevel(this.get('assignment'), this.get('section')) > 0;
  }.property('section.teachers.[]', 'currentUser.actingRole', 'assignment'),

  isBeforeAssignedDate: function() {
    // true if assignedDate is in future
    const currentDate = new Date();
    const assignedDate = this.assignment.get('assignedDate');
    return currentDate < assignedDate;
  }.property('assignment.id', 'assignment.assignedDate'),

  canEditDate: function() {
    const isAdmin = this.get('currentUser.isAdmin');
    const canEdit = this.get('canEdit');
    const isBeforeAssignedDate = this.get('isBeforeAssignedDate');
    return isAdmin || (canEdit && isBeforeAssignedDate);
  }.property('isBeforeAssignedDate', 'canEdit'),

  isDateLocked: Ember.computed.not('canEditDate'),

  getMongoDate: function(htmlDateString) {
    const htmlFormat = 'YYYY-MM-DD';
    if (typeof htmlDateString !== 'string') {
      return;
    }
    let dateMoment = moment(htmlDateString, htmlFormat);
    return new Date(dateMoment);
  },

  getEndDate: function (htmlDateString) {
    const htmlFormat = 'YYYY-MM-DD HH:mm';
    if (typeof htmlDateString !== 'string') {
      return;
    }
    let dateMoment = moment(htmlDateString, htmlFormat);
    let date = new Date(dateMoment);
    date.setHours(23, 59, 59);
    return date;
  },

  showEditButton: function() {
    return !this.get('isEditing') && this.get('hasBasicEditPrivileges');
  }.property('hasBasicEditPrivileges', 'isEditing'),

  actions: {
    editAssignment: function() {
      this.set('isEditing', true);
    },

    showDeleteModal: function () {
      this.get('alert').showModel('warning', 'Are you sure you want to delete this assignment?', null, 'Yes, delete it')
      .then((result) => {
        if (result.value) {
          this.send('deleteAssignment');
        }
      });
    },

    deleteAssignment: function() {
      const assignment = this.get('assignment');
      assignment.set('isTrashed', true);
      return assignment.save().then((assignment) => {
        this.set('assignmentToDelete', null);
        this.get('alert').showToast('success', 'Assignment Deleted', 'bottom-end', 5000, true, 'Undo')
        .then((result) => {
          if (result.value) {
            assignment.set('isTrashed', false);
            assignment.save().then(() => {
              this.get('alert').showToast('success', 'Assignment Restored', 'bottom-end', 5000, false, null);
              window.history.back();
            });
          }
        });
        this.sendAction('toAssignments');
        $(".daterangepicker").remove();
      })
      .catch((err) => {
        this.set('assignmentToDelete', null);
        this.handleErrors(err, 'updateRecordErrors', assignment);
      });
    },

    updateAssignment: function() {
      const assignment = this.get('assignment');

      let selectedProblem = this.get('selectedProblem');
      let selectedSection = this.get('selectedSection');

      let currentProblem = assignment.get('problem.content');
      let currentSection = assignment.get('section.content');

      let didProblemChange = !Ember.isEqual(selectedProblem, currentProblem);
      let didSectionChange = !Ember.isEqual(selectedSection, currentSection);

      let didRelationshipsChange = didProblemChange || didSectionChange;

      const name = this.get('assignmentName');
      assignment.set('name', name);

      if (didProblemChange) {
        assignment.set('problem', selectedProblem);

      }
      if (didSectionChange) {
        assignment.set('section', selectedSection);

      }

      const endDate = $('#dueDate').data('daterangepicker').startDate.format('YYYY-MM-DD');
      const dueDate = this.getEndDate(endDate);

      const assignedDate = assignment.get('assignedDate');
      if (assignedDate > dueDate) {
        this.set('invalidDateRange', true);
        return;
      } else {
        if (this.get('invalidDateRange')) {
          this.set('invalidDateRange', null);
        }
      }


      if (JSON.stringify(dueDate) !== JSON.stringify(assignment.get('dueDate'))) {
        assignment.set('dueDate', dueDate);
      }

      if (assignment.get('hasDirtyAttributes') || didRelationshipsChange) {
        return assignment.save().then(() => {
          this.get('alert').showToast('success', 'Assignment Updated', 'bottom-end', 4000, false, null);
          this.set('assignmentUpdateSuccess', true);
          $(".daterangepicker").remove();
          this.set('isEditing', false);
          return;
        })
        .catch((err) => {
          this.handleErrors(err, 'updateRecordErrors', assignment);
        });
      } else {
        this.set('isEditing', false);
        $(".daterangepicker").remove();
      }
    },
    stopEditing: function() {
      this.set('isEditing', false);
      $(".daterangepicker").remove();
    },
  }
});

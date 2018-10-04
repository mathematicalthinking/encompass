Encompass.AssignmentInfoTeacherComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, Encompass.AddableProblemsMixin, {
  formattedDueDate: null,
  formattedAssignedDate: null,
  isEditing: false,
  isDisplaying: Ember.computed.not('isEditing'),
  showReport: false,
  htmlDateFormat: 'MM/DD/YYYY',
  displayDateFormat: "MMM Do YYYY",
  assignmentToDelete: null,
  dataFetchErrors: [],
  findRecordErrors: [],
  updateRecordErrors: [],
  alert: Ember.inject.service('sweet-alert'),

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
    let currentAssignment= this.get('currentAssignment');
    const assignment = this.assignment;

    if (!Ember.isEqual(currentAssignment, this.assignment)) {
      this.set('isEditing', false);
      this.setAddProblemFunction('addProblemTypeahead');

      if (this.get('showReport')) {
        this.set('showReport', false);
      }
      this.set('currentAssignment', this.assignment);
      let dateFormat = this.get('htmlDateFormat');
      let dueDate = this.assignment.get('dueDate');
      let assignedDate = this.assignment.get('assignedDate');
      this.set('selectedProblem', assignment.get('problem.content'));
      this.set('selectedSection', assignment.get('section.content'));

      this.set('assignmentName', assignment.get('name'));
      this.set('formattedDueDate', moment(dueDate).format(dateFormat));
      this.set('formattedAssignedDate', moment(assignedDate).format(dateFormat));

      return assignment.get('students')
        .then((students) => {
          this.set('studentList', students);
          return this.assignment.get('answers');
        })
        .then((answers) => {
          const sorted = answers.sortBy('createdBy.username');
          this.set('assignmentAnswers', sorted);

          let studentList = this.get('studentList');

          return studentList.map((student) => {
            let filtered = sorted.filterBy('createdBy.username', student.get('username'));
            let sortedByDate = filtered.sortBy('createDate').reverse();
            student.set('filteredAnswers', sortedByDate);
            this.set('showReport', true);
            return student;
          });
        })
        .catch((err) => {
          this.handleErrors(err, 'findRecordErrors');
        });
    }
  },

  willDestroyElement: function () {
    $(".daterangepicker").remove();
    this._super(...arguments);
  },

  isYourOwn: function() {
    const currentUserId = this.get('currentUser.id');
    const creatorId = this.assignment.get('createdBy.id');
    return currentUserId === creatorId;
  }.property('assignment.id'),

  isDirty: function() {
    const answers = this.get('assignmentAnswers');
    return !Ember.isEmpty(answers);
  }.property('assignmentAnswers.[]'),

  isClean: Ember.computed.not('isDirty'),

  canDelete: function() {
    const isAdmin = this.get('currentUser.isAdmin');
    const isClean = this.get('isClean');
    const isYourOwn = this.get('isYourOwn');

    return isAdmin || (isClean && isYourOwn);
  }.property('isClean', 'isYourOwn'),

  canEdit: function() {
    const isAdmin = this.get('currentUser.isAdmin');
    const isClean = this.get('isClean');
    const isYourOwn = this.get('isYourOwn');

    return isAdmin || (isClean && isYourOwn);
  }.property('isClean', 'isYourOwn'),
  isReadOnly: Ember.computed.not('canEdit'),

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
          this.set('isEditing', false);
          return;
        })
        .catch((err) => {
          this.handleErrors(err, 'updateRecordErrors', assignment);
        });
      } else {
        this.set('isEditing', false);
      }
    },
    stopEditing: function() {
      this.set('isEditing', false);
    },
  }
});

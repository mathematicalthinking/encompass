Encompass.AssignmentInfoTeacherComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  formattedDueDate: null,
  formattedAssignedDate: null,
  isEditing: false,
  isDisplaying: Ember.computed.not('isEditing'),
  showReport: false,
  htmlDateFormat: 'YYYY-MM-DD',
  displayDateFormat: "MMM Do YYYY",
  assignmentToDelete: null,

  init: function() {
    this._super(...arguments);
    // get all sections and problems
    // only need to get these on init because user won't be creating new sections or problems from this component
    return this.store.findAll('section')
      .then((sections) => {
        this.set('sections', sections);
        return this.store.findAll('problem');
      })
      .then((problems) => {
        this.set('problems', problems);
        return;
      })
      .catch((err) => {
        this.set('initalDataFetchError', err);
      });
  },

  didReceiveAttrs: function() {
    if (this.get('showReport')) {
      this.set('showReport', false);
    }
    const assignment = this.assignment;
    if (this.assignment) {
      let dateFormat = this.get('htmlDateFormat');
      let dueDate = this.assignment.get('dueDate');
      let assignedDate = this.assignment.get('assignedDate');

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
          console.log(err);
        });
      }
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

  actions: {
    editAssignment: function() {
      this.set('isEditing', true);
    },

    deleteAssignment: function() {
      const assignment = this.get('assignment');
      assignment.set('isTrashed', true);
      return assignment.save().then((assignment) => {
        this.set('assignmentToDelete', null);

        this.sendAction('toAssignments');
      })
      .catch((err) => {
        this.set('assignmentToDelete', null);
        this.set('deleteAssignmentError', err);
      });
    },
    updateAssignment: function() {
      console.log('updating assignment');
      const assignment = this.get('assignment');
      const values = ['section', 'problem', 'assignedDate', 'dueDate'];

      const htmlDueDate = this.get('formattedDueDate');
      const htmlAssignedDate = this.get('formattedAssignedDate');

      this.set('dueDate', this.getMongoDate(htmlDueDate));
      this.set('assignedDate', this.getMongoDate(htmlAssignedDate));

      for (let value of values) {
        assignment.set(value, this.get(value));
      }
      return assignment.save().then((assignment) => {
        this.set('assignmentUpdateSuccess', true);
        this.set('isEditing', false);
        return;
      })
      .catch((err) => {
        this.set('updateAssignmentError', err);
      });

    },
    stopEditing: function() {
      this.set('isEditing', false);
    },
  }
});

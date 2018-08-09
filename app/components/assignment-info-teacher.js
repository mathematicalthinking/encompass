Encompass.AssignmentInfoTeacherComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  formattedDueDate: null,
  formattedAssignedDate: null,
  isEditing: false,
  isDisplaying: Ember.computed.not('isEditing'),
  showReport: false,


  // sortedAnswers: function() {
  //   if (this.get('answers')) {
  //     return this.get('answers').sortBy('createDate').reverse();
  //   }
  //   return [];
  // }.property('answers.[]'),

  // priorAnswer: function() {
  //   return this.get('sortedAnswers').get('firstObject');
  // }.property('sortedAnswers.[]'),

  isYourOwn: function() {
    const currentUser = this.get('currentUser');
    const creatorId = this.assignment.get('createdBy.userId');
    return currentUser.get('userId') === creatorId;
  }.property('assignment.id', 'currentUser.userId'),

  isAnswersEmpty: function() {
    const answers = this.get('assignmentAnswers');
    return Ember.isEmpty(answers);
  }.property('assignmentAnswers.[]'),

  isAssignedDateLocked: function() {
    // locked if current date is later than assigned date
    const currentDate = new Date();
    const assignedDate = this.assignment.get('assignedDate');
    console.log('currentDate', currentDate);
    console.log('assignedDate', assignedDate);
    let x = currentDate > assignedDate;
    console.log('x', x);
    return currentDate > assignedDate;
  }.property('assignment.id','isEditing'),

  canDelete: Ember.computed.and('isYourOwn', 'isAnswersEmpty'),

  isProblemLocked: function() {
    //can be edited only if no submissions have been recorded yet
    return !Ember.isEmpty(this.get('assignmentAnswers')) || this.get('isDisplaying');
  }.property('assignmentAnswers.[]', 'isDisplaying'),

  didReceiveAttrs: function() {
    if (this.get('showReport')) {
      this.set('showReport', false);
    }
    const assignment = this.assignment;
    if (this.assignment) {
      let dateTime = 'YYYY-MM-DD';
      let dueDate = this.assignment.get('dueDate');
      let assignedDate = this.assignment.get('assignedDate');
      this.set('formattedDueDate', moment(dueDate).format(dateTime));
      this.set('formattedAssignedDate', moment(assignedDate).format(dateTime));

      // get sections
      return this.store.findAll('section')
        .then((sections) => {
          this.set('sections', sections);
          return this.store.findAll('problem');
        })
        .then((problems) => {
          this.set('problems', problems);
          return assignment.get('students');
        }).then((students) => {
          this.set('studentList', students);
          return students;
        }).then(() => {
          const id = this.assignment.id;
          return this.store.findAll('answer').then((answers) => {
            return answers.filterBy('assignment.id', id);
        }).then((answers) => {
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
    });
        })
      .catch((err) => {
        console.log(err);
      });
    }
  },

  actions: {
    editAssignment: function() {
      this.set('isEditing', true);
    },

    deleteAssignment: function() {
      console.log('deleting assignment');
      const assignment = this.get('assignment');
      assignment.set('isTrashed', true);
      return assignment.save().then((assignment) => {
        this.set('deleteAssignmentSuccess', true);
        this.sendAction('toAssignments');
      })
      .catch((err) => {
        this.set('deleteAssignmentError', err);
      });
    },
    updateAssignment: function() {
      console.log('updating assignment');
      const assignment = this.get('assignment');
      const values = ['section', 'problem', 'assignedDate', 'dueDate'];

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
    }
  }

});

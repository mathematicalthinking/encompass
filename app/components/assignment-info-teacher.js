Encompass.AssignmentInfoTeacherComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  formattedDueDate: null,
  formattedAssignedDate: null,
  isEditing: false,
  isDisplaying: Ember.computed.not('isEditing'),
  selectedSection: null,

  didInsertElement: function() {
    return this.getAnswers().then((answers) => {
      this.set('answerList', answers);
    });
  },

  getAnswers: function() {
    const id = this.assignment.id;
    //return this.store.findAll('answer');
    return this.assignment.get('students').then((students) => {
      this.set('studentList', students);
      return Promise.all(students.map((student) => {
        return student.get('answers');
      }));

    })
    .then((answers) => {
      console.log('answers', answers);
      return answers;
    })
    .catch((err) => {
      console.log('err', err);
    });
},

  sortedAnswers: function() {
    if (this.get('answers')) {
      return this.get('answers').sortBy('createDate').reverse();
    }
    return [];
  }.property('answers.[]'),

  priorAnswer: function() {
    return this.get('sortedAnswers').get('firstObject');
  }.property('sortedAnswers.[]'),


  isProblemLocked: function() {
    //can be edited only if no submissions have been recorded yet
    return !Ember.isEmpty(this.get('answers')) || this.get('isDisplaying');
  }.property('answers.[]', 'isDisplaying'),

  didReceiveAttrs: function() {

    this.set('selectedSection', this.section);
    if (this.assignment) {
      let dateTime = 'YYYY-MM-DD';
      let dueDate = this.assignment.get('dueDate');
      let assignedDate = this.assignment.get('assignedDate');
      this.set('formattedDueDate', moment(dueDate).format(dateTime));
      this.set('formattedAssignedDate', moment(assignedDate).format(dateTime));
      return this.store.findAll('section')
        .then((sections) => {
          this.set('sections', sections);
          return this.store.findAll('problem');
        })
        .then((problems) => {
          this.set('problems', problems);

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
        console.log('assignment', assignment);
        console.log('changed attrs', assignment.changedAttributes());
        this.set('deleteAssignmentSuccess', true);
        this.sendAction('toAssignments');
      })
      .catch((err) => {
        this.set('deleteAssignmentError', err);
      });
    },
    updateAssignment: function() {
      const assignment = this.get('assignment');

      const values = ['selectedSection', 'selectedProblem', 'assignedDate', 'dueDate'];

      for (let value of values) {
        assignment.set(value, this.get(value));
      }
      },
    stopEditing: function() {
      this.set('isEditing', false);
    }
  }

});

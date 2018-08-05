Encompass.AssignmentReportComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {

  didReceiveAttrs: function() {
    console.log('receiving attrs', this.students);
    // Need to filter answers to this assignment by student
      const students = this.students;
    const assignment = this.assignment;

    // const mapped = Promise.all(students.map((student) => {
    //   console.log('stud', student);
    //   return this.getAnswers(student, assignment)
    //   .then((answers) => {
    //     console.log(student.get('username'), answers);
    //     student.set('answers', answers);
    //     return student;
    //   });
    // }));
    // this.set('studentList', mapped);
    // }
    console.log('assn answers', this.assignment.get('answers'));
    //return this.getAnswersByAssignment().then(console.log);
  },

  getAnswersByAssignment: function() {
    const student = this.students.objectAt(2);
    console.log('student', student);
    const assignment = this.assignment;

    return student.get('answers').then((answers) => {
      if (answers) {
        const filtered = answers.filter((ans) => {
          return ans.get('assignment')
          .then((assn) => {
            console.log('assn', assn);
            if (assn) {
              return assn.id === assignment.id;
            }
          });
        });
        return Promise.all(filtered).then(console.log);
      }

    });
  },

  getAnswers: function(student, assignment) {
    return student.get('answers');
    },

  filterByAssignment: function(answers, assignment) {
    return Promise.all(answers.filter((answer) => {
      return answer.get('assignment')
      .then((assn) => {
        console.log('assn', assn);
        return assn.id === assignment.id;
      })
      .catch((err) => {
        console.log(err);
      });
    }))
    .catch((err) => {
      console.log(err);
    });
  }



});
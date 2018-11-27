Encompass.SectionInfoComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {
  elementId: 'section-info',
  className: ['section-info'],
  alert: Ember.inject.service('sweet-alert'),
  removeTeacherError: null,
  isEditingStudents: false,
  isEditingTeachers: false,
  organization: null,
  studentList: null,
  teacherList: null,
  showAssignment: false,
  problemList: null,
  sectionList: [],
  sectionToDelete: null,
  pending: '<p>Loading results...</p>',
  notFound: '<p>No matching users.</p>',
  dataLoadErrors: [],
  updateSectionErrors: [],
  updateTeacherErrors: [],
  updateStudentErrors: [],
  queryErrors: [],
  findRecordErrors: [],
  problemLoadErrors: [],

  init: function () {
    this._super(...arguments);
    return this.setSectionAttributes().then(() => {
      // console.log('section info set!');
    });

  },

  didReceiveAttrs: function () {
    let section = this.get('currentSection');
    let didSectionChange = !Ember.isEqual(section, this.section);
    this.set('isEditing', false);
    this.set('isAddingTeacher', false);

    if (didSectionChange) {
      if (this.get('isEditingStudents')) {
        this.set('isEditingStudents', false);
      }

      if (this.get('isEditingTeachers')) {
        this.set('isEditingTeachers', false);
      }
      return this.setSectionAttributes();
    }
  },

  setSectionAttributes: function () {
    let section = this.get('section');
    this.set('currentSection', section);
    return Promise.resolve(section.get('students'))
      .then((students) => {
        this.set('studentList', students);
        return section.get('teachers');
      })
      .then((teachers) => {
        this.set('teacherList', teachers);
        return section.get('organization');
      })
      .then((org) => {
        this.set('organization', org);
      })
      .catch((err) => {
        this.handleErrors(err, 'dataLoadErrors');
      });
  },

  didInsertElement: function () {
    this.set('addTeacherTypeahead', this.getAddableUsers.call(this, true));
    this.set('addStudentTypeahead', this.getAddableUsers.call(this, false));
  },

  cantEdit: Ember.computed('section.id', function () {
    let currentUser = this.get('currentUser');
    let isStudent = currentUser.get('isStudent');

    let cantEdit = isStudent;
    return cantEdit;
  }),

  addTeacher: function () {
    let teacher = this.get('teacherToAdd');

    if (!teacher) {
      return;
    }
    let section = this.get('currentSection');

    let sectionObj = {
      sectionId: section.id,
      role: 'teacher'
    };

    let teachers = this.get('teacherList');

    if (!teachers.includes(teacher)) {
      teachers.pushObject(teacher);

      section.save().then(() => {
        if (!teacher.get('sections')) {
          teacher.set('sections', []);
        }
        teacher.get('sections').pushObject(sectionObj);
        teacher.save().then(() => {
          this.get('alert').showToast('success', 'Teacher Added', 'bottom-end', 3000, false, null);
          this.set('teacherToAdd', null);
        }).catch((err) => {
          this.handleErrors(err, 'updateTeacherErrors', teacher);
        });
      }).catch((err) => {
        this.handleErrors(err, 'updateSectionErrors', section);
      });
    }
  }.observes('teacherToAdd'),

  scrollIfEditingStudents: function () {
    if (this.get('isEditingStudents')) {
      Ember.run.later(() => {
        $('html, body').animate({
          scrollTop: $(document).height()
        });
      }, 100);
    }
  }.observes('isEditingStudents'),

  getAddableUsers: function (doGetTeachers) {
    const store = this.get('store');

    let ret = function (query, syncCb, asyncCb) {
      let selectedUsers;

      if (doGetTeachers) {
        selectedUsers = this.get('teacherList');
      } else {
        selectedUsers = this.get('studentList');
      }
      let text = query.replace(/\W+/g, "");
      return store.query('user', {
          usernameSearch: text,
        }).then((users) => {
          if (!users) {
            return [];
          }
          if (doGetTeachers) {
            users = users.rejectBy('accountType', 'S');
          }
          let filtered = users.filter((user) => {
            return !selectedUsers.includes(user);
          });
          return asyncCb(filtered.toArray());
        })
        .catch((err) => {
          this.handleErrors(err, 'queryErrors');
        });
    };
    return ret.bind(this);
  },

  actions: {
    removeStudent: function (user) {
      let section = this.get('currentSection');
      let students = section.get('students');
      let selectedUser = user;
      let selectedUserId = selectedUser.get('id');
      students.removeObject(selectedUser);

      section.save().then((section) => {
        return this.store.findRecord('user', selectedUserId)
          .then((user) => {
            let userSections = user.get('sections');
            if (!userSections) {
              this.set('removedStudent', true);
              return;
            }
            let removedSectionId = section.get('id');
            let newSections = [];
            userSections.map((section) => {
              if (section.sectionId !== removedSectionId) {
                newSections.push(section);
              }
            });
            user.set('sections', newSections);
            user.save().then((res) => {
              this.get('alert').showToast('success', 'Student Removed', 'bottom-end', 3000, false, null);
            }).catch((err) => {
              this.handleErrors(err, 'updateStudentErrors', user);
            });
          }).catch((err) => {
            this.handleErrors(err, 'findRecordErrors');
          });
      }).catch((err) => {
        this.handleErrors(err, 'updateSectionErrors', section);
      });
      this.set('removedStudent', true);
    },

    removeTeacher: function (user) {
      let section = this.get('currentSection');
      let teachers = this.get('teacherList');
      let teachersLength = teachers.get('length');
      let selectedUser = user;
      let selectedUserId = selectedUser.get('id');

      if (teachersLength > 1) {
        teachers.removeObject(user);
      } else {
        this.set('removeTeacherError', true);
        Ember.run.later((() => {
          this.set('removeTeacherError', false);
        }), 3000);
        return;
      }

      section.save().then((section) => {
        return this.store.findRecord('user', selectedUserId)
          .then((user) => {
            let userSections = user.get('sections');
            if (!userSections) {
              return;
            }
            let removedSectionId = section.get('id');
            let newSections = [];
            userSections.map((section) => {
              if (section.sectionId !== removedSectionId) {
                newSections.push(section);
              }
            });
            user.set('sections', newSections);
            user.save().then((res) => {
              this.get('alert').showToast('success', 'Teacher Removed', 'bottom-end', 3000, false, null);
            }).catch((err) => {
              this.handleErrors(err, 'updateTeacherErrors', user);
            });
          }).catch((err) => {
            this.handleErrors(err, 'findRecordErrors');
          });
      });
      this.set('removedTeacher', true);
    },

    confirmDelete: function () {
      this.get('alert').showModal('warning', 'Are you sure you want to delete this class?', 'This may interfere with any work you have already created.', 'Yes, delete it')
        .then((result) => {
          if (result.value) {
            this.send('deleteSection');
          }
        });
    },

    deleteSection: function () {
      const section = this.get('section');
      section.set('isTrashed', true);
      return section.save().then(() => {
          this.get('alert').showToast('success', 'Class Deleted', 'bottom-end', 3000, false, null);
          this.sendAction('toSectionList');
        })
        .catch((err) => {
          this.set('sectionToDelete', null);
          this.handleErrors(err, 'updateSectionErrors', section);
        });
    },

    toAssignmentInfo: function (assignment) {
      this.sendAction('toAssignmentInfo', assignment);
    },

    showAssignment: function () {
      return this.store.findAll('problem')
        .then((problems) => {
          this.set('problemList', problems);
          this.set('showAssignment', true);
          this.get('sectionList').pushObject(this.section);

          Ember.run.later(() => {
            $('html, body').animate({
              scrollTop: $(document).height()
            });
          }, 100);
        })
        .catch((err) => {
          this.handleErrors(err, 'problemLoadErrors');
        });
    },

    updateSectionName: function () {
      this.set('isEditingName', false);
      let section = this.get('currentSection');
      if (section.get('hasDirtyAttributes')) {
        this.get('currentSection').save().then(() => {
          this.get('alert').showToast('success', 'Class Name Updated', 'bottom-end', 3000, false, null);
        }).catch((err) => {
          this.handleErrors(err, 'updateSectionErrors', section);
        });
      }
    },
  }
});
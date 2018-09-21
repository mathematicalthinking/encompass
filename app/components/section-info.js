Encompass.SectionInfoComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'section-info',
  className: ['section-info'],
  isEditing: false,
  sectionName: null,
  teacher: null,
  isAddStudents: false,
  createdStudents: null,
  selectedOrganization: null,
  isAddingStudents: false,
  usingDefaultPassword: true,
  usernameAlreadyExists: null,
  doYouWantToAddExistingUser: null,
  userAlreadyInSection: null,
  isMissingPassword: null,
  isMissingUsername: null,
  missingFieldsError: null,
  removeTeacherError: null,
  showingPassword: false,
  isEditingStudents: false,
  removeObject: null,
  organization: null,
  isStudent: false,
  studentList: null,
  studentUsername: "",
  teacherUsername: "",
  fieldType: 'password',
  showAssignment: false,
  problemList: null,
  isAddingTeacher: false,
  sectionList: [],
  sectionToDelete: null,
  pending: '<p>Loading results...</p>',
  notFound: '<p>No matching users.</p>',

  init: function () {
    this._super(...arguments);

   return this.setSectionAttributes().then(() => {
     console.log('section info set!');
   });

  },

  didReceiveAttrs: function () {
    let section = this.get('currentSection');
    let didSectionChange = !Ember.isEqual(section, this.section);
    console.log('didSectionChange', didSectionChange);
    this.set('isEditing', false);
    this.set('isAddingTeacher', false);


    if (didSectionChange) {
      return this.setSectionAttributes();
    }
  },

  setSectionAttributes: function() {
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
      this.set('sectionInitError', err);
    });
  },

  didInsertElement: function() {
    this.set('addTeacherTypeahead', this.getAddableUsers.call(this, true));
    this.set('addStudentTypeahead', this.getAddableUsers.call(this, false));
  },

  willDestroyElement: function () {
    this.set('createdStudents', null);
  },

  cantEdit: Ember.computed('section.id', function () {
    let currentUser = this.get('currentUser');
    let isStudent = currentUser.get('isStudent');

    let cantEdit = isStudent;
    return cantEdit;
  }),


  searchResults: function () {
    var searchText = this.get('studentUsername');
    searchText = searchText.replace(/\W+/g, "");
    if (searchText.length < 2) {
      return;
    }

    let people = this.get('store').query('user', {
      usernameSearch: searchText,
    });
    return people;
  }.property('studentUsername'),

  setTeacherSearchResults: function () {
    var searchText = this.get('teacherUsername');
    searchText = searchText.replace(/\W+/g, "");
    if (searchText.length < 2) {
      return;
    }
    this.get('store').query('user', {
      usernameSearch: searchText,
    }).then((people) => {
      this.set('teacherSearchResults', people.rejectBy('accountType', 'S'));
    });
  }.observes('teacherUsername'),


  isShowingPassword: Ember.computed(function () {
    var showing = this.get('showingPassword');
    return showing;
  }),

  addTeacher: function() {
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
          console.log('saved teacher');
          this.set('teacherToAdd', null);
        });
      });
    }
  }.observes('teacherToAdd'),

  scrollIfEditingStudents: function() {
    Ember.run.later(() => {
      $('html, body').animate({scrollTop: $(document).height()});
    }, 100);
  }.observes('isEditingStudents'),

  getAddableUsers: function(doGetTeachers) {
    const store = this.get('store');

    let ret = function(query, syncCb, asyncCb) {
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
          console.log('err', err);
        });
      };

      return ret.bind(this);
    },

  actions: {
    addNewStudents: function () {
      this.set('isAddingStudents', true);
    },

    addTeachers: function () {
      this.set('isAddingTeachers', true);
    },

    doneAddTeachers: function() {
      this.set('isAddingTeachers', false);
    },

    doYouWantToAddExistingUser: function () {
      this.set('doYouWantToAddExistingUser', false);
      this.set('userAlreadyInSection', false);
    },

    userAlreadyInSection: function () {
      this.set('userAlreadyInSection', false);
      this.set('doYouWantToAddExistingUser', false);
    },

    exitAddExistingUsername: function () {
      this.set('doYouWantToAddExistingUser', false);
      this.set('userAlreadyInSection', false);
      this.set('studentUsername', '');
    },

    addStudent: function (student) {
      let section = this.get('section');
      let username = this.get('studentUsername');
      //check if username already exists in section
      let students = section.get('students');

      var checkRegisteredStudent = students.filterBy('username', username);
      //isempty will check the STUDENTS list (in front-end) to see if
      //the new username we are trying to add already exists.
      if (!Ember.isEmpty(checkRegisteredStudent)) {
        this.set('userAlreadyInSection', true);
        console.log('user not in this section');
      } else if (!section.get('students').contains(student)){
        section.get('students').pushObject(student);
        section.save();  //adds the new student (username) to database (backend)
      }

      let sectionObj = {
        sectionId: section.id,
        role: 'student'
      };

      return this.store.findRecord('user', student.id).then((student) => {
        students.pushObject(student);  //add student into students list
        this.set('doYouWantToAddExistingUser', false);
        //save section in student
        section.save().then((section) => {
          console.log('saved section', section);
          if (!student.get('sections')) {
            student.set('sections', []);
          }
          student.get('sections').addObject(sectionObj);
          student.save().then((rec) => {
            this.set('studentUsername', '');
          });
        });
     });
    },

    removeStudent: function (user) {
      let section = this.get('section');
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
            user.save();
          });
        });
        this.set('removedStudent', true);
    },


    addTeacher: function (teacher) {
      let section = this.get('section');
      let username = this.get('teacherUsername');
      let teachers = section.get('teachers');

      var checkRegisteredTeacher = teachers.filterBy('username', username);
      if (!Ember.isEmpty(checkRegisteredTeacher)) {
        this.set('userAlreadyInSection', true);
        console.log('user not in this section');
      } else if (!section.get('teachers').contains(teacher)) {
        section.get('teachers').pushObject(teacher);
        section.save();
      }

      let sectionObj = {
        sectionId: section.id,
        role: 'teacher'
      };

      return this.store.findRecord('user', teacher.id).then((teacher) => {
        teachers.pushObject(teacher); //add student into students list
        this.set('doYouWantToAddExistingUser', false);
        //save section in student
        section.save().then((section) => {
          if (!teacher.get('sections')) {
            teacher.set('sections', []);
          }
          let sections = teacher.get('sections');
          sections.addObject(sectionObj);

          teacher.save().then((rec) => {
            this.set('teacherUsername', '');
            this.set('teacherSearchResults', null);
          });
        });
      });
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
            let removedSectionId =section.get('id');
            let newSections = [];
            userSections.map((section) => {
              if (section.sectionId !== removedSectionId) {
                newSections.push(section);
              }
            });
            user.set('sections', newSections);
            user.save();
          });
      });
      this.set('removedTeacher', true);
    },


    showPassword: function () {
      var isShowingPassword = this.get('showingPassword');
      console.log('isShowingPassword =', isShowingPassword);
      if (isShowingPassword === false) {
        this.set('showingPassword', true);
        this.set('fieldType', 'text');
      } else {
        this.set('showingPassword', false);
        this.set('fieldType', 'password');
      }
    },

    createStudent: function () {
      var that = this;
      let organization = this.get('organization');
      var name = this.get('studentName');
      var username = this.get('studentUsername');
      var usingDefaultPassword = this.get('usingDefaultPassword');
      var password;
      var sectionId = this.get('section').id;
      var sectionRole = 'student';
      var currentUser = that.get('currentUser');
      let section = this.get('section');
      //let students = section.get('students');

      if (usingDefaultPassword) {
        password = this.get('defaultPassword');
      } else {
        password = this.get('studentPassword');
      }

      if (!password) {
        this.set('isMissingPassword', true);
        return;
      }
      if (!username) {
        this.set('isMissingUsername', true);
        return;
      }

      var createUserData = {
        name: name,
        username: username,
        password: password,
        sectionId: sectionId,
        sectionRole: sectionRole,
        createdBy: currentUser.id,
        isAuthorized: true,
        accountType: 'S'
      };

      if (organization) {
        createUserData.organization = organization.id;
      }

      return Ember.$.post({
        url: '/auth/signup',
        data: createUserData
      })
        .then((res) => {
          if (res.message === 'Username already exists') {
            that.set('usernameAlreadyExists', true);
          } else if (res.message === 'Can add existing user') {
            this.set('doYouWantToAddExistingUser', true);
            this.set('existingUser', res.user);
          } else {
            var userId = res._id;
            var section = this.get('section');
            var students = section.get('students');
            var studentPassword = section.get('studentPassword');
            console.log('section password is currently', studentPassword);
            return this.store.findRecord('user', userId)
              .then((user) => {
                students.pushObject(user);   //add student to students aray
                section.save();  //save section
                this.set('name', '');   //after save clear fields
                this.set('studentUsername', '');   //after save clear fields
                if (!usingDefaultPassword) {
                  this.set('studentPassword', '');   //after save clear fields
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    toggleAddExistingStudent: function () {
      if (this.get('isAddingExistingStudents') !== true) {
        this.set('isAddingExistingStudents', true);
      } else {
        this.set('isAddingExistingStudents', false);
      }
    },

    doneAdding: function () {
      this.set('isAddingStudents', false);
      // this.set('problemPublic', problem.get('isPublic'));
    },

    editSection: function () {
      let section = this.get('section');
      this.set('isEditing', true);
      this.set('sectionName', section.get('name'));
      let teacher = section.get('teachers');
    },

    updateSection: function () {
      let name = this.get('sectionName');
      let section = this.get('section');
      section.set('name', name);
      section.save();
      this.set('isEditing', false);
    },

    deleteSection: function() {
      const section = this.get('section');
      section.set('isTrashed', true);
      return section.save().then((section) => {
        this.set('sectionToDelete', null);
        this.sendAction('toSectionList');
      })
      .catch((err) => {
        this.set('sectionToDelete', null);
        this.set('deleteSectionError', err);
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
            $('html, body').animate({scrollTop: $(document).height()});
          }, 100);
        })
        .catch((err) => {
          this.set('problemLoadErr', err);
        });
      },

    checkError: function () {
      if (this.invalidTeacherUsername) {
        this.set('invalidTeacherUsername', false);
      }

      if (this.usernameAlreadyExists) {
        this.set('usernameAlreadyExists', false);
      }

      if (this.doYouWantToAddExistingUser) {
        this.set('doYouWantToAddExistingUser', false);
      }

      if (this.userAlreadyInSection) {
        this.set('userAlreadyInSection', false);
      }

      if (this.isMissingPassword) {
        this.set('isMissingPassword', false);
      }
      if (this.missingFieldsError) {
        this.set('missingFieldsError', false);
      }
    }
  }
});